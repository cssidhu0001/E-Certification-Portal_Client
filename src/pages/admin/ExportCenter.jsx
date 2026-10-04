import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getReportConfig,
  previewReport,
  exportReport,
} from "../../services/api";

import styles from "./ExportCenter.module.css";

function ExportCenter() {
  const token = localStorage.getItem("adminToken");

  const [config, setConfig] = useState(null);
  const [dataset, setDataset] = useState("candidates");

  const [filters, setFilters] = useState({});
  const [columns, setColumns] = useState([]);

  const [previewRows, setPreviewRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [loadingConfig, setLoadingConfig] = useState(true);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [generatedFilename, setGeneratedFilename] = useState("");

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      setLoadingConfig(true);
      setError("");

      const data = await getReportConfig(token);

      setConfig(data.datasets);

      const candidateConfig = data.datasets.candidates;

      setColumns(candidateConfig.defaultColumns || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingConfig(false);
    }
  };

  const currentDataset = useMemo(() => {
    return config?.[dataset] || null;
  }, [config, dataset]);

  const filterFields = useMemo(() => {
    if (!currentDataset) return [];

    return currentDataset.fields.filter(
      (field) => field.filterable
    );
  }, [currentDataset]);

  const exportFields = useMemo(() => {
    if (!currentDataset) return [];

    return currentDataset.fields.filter(
      (field) => field.exportable
    );
  }, [currentDataset]);

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleDateChange = (key, type, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: {
        ...(previous[key] || {}),
        [type]: value,
      },
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setPreviewRows([]);
    setTotalRecords(0);
    setSuccess("");
  };

  const toggleColumn = (key) => {
    setColumns((previous) => {
      if (previous.includes(key)) {
        return previous.filter((item) => item !== key);
      }

      return [...previous, key];
    });
  };

  const handlePreview = async () => {
    try {
      setPreviewLoading(true);
      setError("");
      setSuccess("");

      const data = await previewReport(
        {
          dataset,
          filters,
          columns,
        },
        token
      );

      setPreviewRows(data.rows || []);
      setTotalRecords(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);
      setError("");
      setSuccess("");

      setGeneratedPassword("");
      setGeneratedFilename("");

      const result = await exportReport(
        {
          dataset,
          filters,
          columns,
        },
        token
      );

      const blobUrl = window.URL.createObjectURL(result.blob);

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = result.filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(blobUrl);

      setGeneratedPassword(result.password);
      setGeneratedFilename(result.filename);

      setSuccess(
        "Excel generated successfully. Keep the password safe."
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setExportLoading(false);
    }
  };

  if (loadingConfig) {
    return (
      <main className={styles.page}>
        <div className={styles.loading}>
          Loading Export Center...
        </div>
      </main>
    );
  }

  if (!currentDataset) {
    return (
      <main className={styles.page}>
        <div className={styles.errorBox}>
          Report configuration could not be loaded.
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}

        <div className={styles.header}>
          <div>
            <Link
              to="/admin/dashboard"
              className={styles.back}
            >
              ← Back to Dashboard
            </Link>

            <span className={styles.label}>
              ADMIN TOOLS
            </span>

            <h1>Export Center</h1>

            <p>
              Build custom reports, preview the data and
              generate password-protected Excel files.
            </p>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className={styles.errorBox}>
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className={styles.successBox}>
            {success}
          </div>
        )}

        {/* DATASET */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.step}>
                STEP 01
              </span>

              <h2>Select Dataset</h2>

              <p>
                Choose the data you want to export.
              </p>
            </div>
          </div>

          <select
            className={styles.select}
            value={dataset}
            onChange={(e) => {
              setDataset(e.target.value);
              setFilters({});
              setPreviewRows([]);
              setTotalRecords(0);

              const nextConfig =
                config[e.target.value];

              setColumns(
                nextConfig?.defaultColumns || []
              );
            }}
          >
            {Object.entries(config).map(
              ([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              )
            )}
          </select>
        </section>

        {/* FILTERS */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.step}>
                STEP 02
              </span>

              <h2>Filters</h2>

              <p>
                Select which records should be included.
              </p>
            </div>

            <button
              type="button"
              className={styles.clearButton}
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          <div className={styles.filterGrid}>
            {filterFields.map((field) => {
              if (field.type === "select") {
                return (
                  <label
                    key={field.key}
                    className={styles.field}
                  >
                    <span>{field.label}</span>

                    <select
                      value={filters[field.key] || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          field.key,
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        All
                      </option>

                      {field.options?.map(
                        (option) => (
                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>
                        )
                      )}
                    </select>
                  </label>
                );
              }

              if (field.type === "date") {
                return (
                  <div
                    key={field.key}
                    className={styles.dateGroup}
                  >
                    <span>{field.label}</span>

                    <div>
                      <input
                        type="date"
                        value={
                          filters[field.key]?.from ||
                          ""
                        }
                        onChange={(e) =>
                          handleDateChange(
                            field.key,
                            "from",
                            e.target.value
                          )
                        }
                      />

                      <input
                        type="date"
                        value={
                          filters[field.key]?.to ||
                          ""
                        }
                        onChange={(e) =>
                          handleDateChange(
                            field.key,
                            "to",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                );
              }

              return (
                <label
                  key={field.key}
                  className={styles.field}
                >
                  <span>{field.label}</span>

                  <input
                    type="text"
                    placeholder={`Search ${field.label}`}
                    value={filters[field.key] || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        field.key,
                        e.target.value
                      )
                    }
                  />
                </label>
              );
            })}
          </div>
        </section>

        {/* COLUMNS */}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.step}>
                STEP 03
              </span>

              <h2>Select Columns</h2>

              <p>
                Choose the fields you want in Excel.
              </p>
            </div>
          </div>

          <div className={styles.columnsGrid}>
            {exportFields.map((field) => (
              <label
                key={field.key}
                className={styles.checkbox}
              >
                <input
                  type="checkbox"
                  checked={columns.includes(field.key)}
                  onChange={() =>
                    toggleColumn(field.key)
                  }
                />

                <span>{field.label}</span>
              </label>
            ))}
          </div>

          {columns.length === 0 && (
            <div className={styles.warning}>
              Please select at least one column.
            </div>
          )}
        </section>

        {/* ACTIONS */}

        <section className={styles.actions}>
          <button
            type="button"
            className={styles.previewButton}
            onClick={handlePreview}
            disabled={
              previewLoading ||
              columns.length === 0
            }
          >
            {previewLoading
              ? "Loading Preview..."
              : "Preview Data"}
          </button>

          <button
            type="button"
            className={styles.exportButton}
            onClick={handleExport}
            disabled={
              exportLoading ||
              columns.length === 0
            }
          >
            {exportLoading
              ? "Generating Excel..."
              : "Generate Excel ↓"}
          </button>
        </section>

        {/* PASSWORD */}

        {generatedPassword && (
          <section className={styles.passwordCard}>
            <div>
              <span className={styles.step}>
                EXCEL PASSWORD
              </span>

              <h2>Keep this password safe</h2>

              <p>
                This password is required to open the
                downloaded Excel file.
              </p>

              {generatedFilename && (
                <small>
                  File: {generatedFilename}
                </small>
              )}
            </div>

            <div className={styles.passwordBox}>
              <code>{generatedPassword}</code>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    generatedPassword
                  )
                }
              >
                Copy
              </button>
            </div>
          </section>
        )}

        {/* PREVIEW */}

        {previewRows.length > 0 && (
          <section className={styles.previewCard}>
            <div className={styles.previewHeader}>
              <div>
                <span className={styles.step}>
                  PREVIEW
                </span>

                <h2>Report Preview</h2>
              </div>

              <strong>
                {totalRecords} total records
              </strong>
            </div>

            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    {columns.map((column) => {
                      const field =
                        currentDataset.fields.find(
                          (item) =>
                            item.key === column
                        );

                      return (
                        <th key={column}>
                          {field?.label || column}
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                <tbody>
                  {previewRows.map(
                    (row, rowIndex) => (
                      <tr key={rowIndex}>
                        {columns.map((column) => (
                          <td key={column}>
                            {row[column] || "—"}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {totalRecords >
              currentDataset.previewLimit && (
              <div className={styles.previewNote}>
                Showing first{" "}
                {currentDataset.previewLimit} records
                only. The Excel export will contain all
                matching records.
              </div>
            )}
          </section>
        )}

      </div>
    </main>
  );
}

export default ExportCenter;