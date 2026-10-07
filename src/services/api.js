const API_BASE_URL = import.meta.env.VITE_API_URL;

const BACKEND_URL = API_BASE_URL.replace(/\/api$/, "");

async function request(url, options = {}) {
  const response = await fetch(url, options);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const registerCandidate = (payload) =>
  request(`${API_BASE_URL}/candidates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const getCandidateStatus = (email) =>
  request(
    `${API_BASE_URL}/candidates/status?email=${encodeURIComponent(email)}`
  );

export const verifyCertificate = (certificateId) =>
  request(
    `${API_BASE_URL}/verify/${encodeURIComponent(certificateId)}`
  );

export const verifyCertificateManually = (email, certificateId) =>
  request(
    `${API_BASE_URL}/verify?email=${encodeURIComponent(
      email
    )}&certificateId=${encodeURIComponent(certificateId)}`
  );

export const adminLogin = (payload) =>
  request(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

export const getCandidates = (token) =>
  request(`${API_BASE_URL}/candidates`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateCandidateStatus = (id, status, token) =>
  request(`${API_BASE_URL}/candidates/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });


export const downloadCertificate = (certificateUrl) => {
  if (!certificateUrl) {
    throw new Error("Certificate URL not found");
  }

  const downloadUrl = certificateUrl.startsWith("http")
    ? certificateUrl
    : `${BACKEND_URL}${certificateUrl}`;

  let finalUrl = downloadUrl;

  // Cloudinary PDF ko direct download mode mein open karo
  if (finalUrl.includes("res.cloudinary.com")) {
    finalUrl = finalUrl.replace(
      "/raw/upload/",
      "/raw/upload/fl_attachment/"
    );
  }

  const link = document.createElement("a");

  link.href = finalUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  document.body.appendChild(link);
  link.click();
  link.remove();
};


export const getReportConfig = async (token) => {
  return request(`${API_BASE_URL}/reports/config`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const previewReport = async (payload, token) => {
  return request(`${API_BASE_URL}/reports/preview`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
};

export const exportReport = async (payload, token) => {
  const response = await fetch(`${API_BASE_URL}/reports/export`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));

    throw new Error(
      data.message || "Unable to generate Excel report."
    );
  }

  const blob = await response.blob();

  const password =
    response.headers.get("X-Export-Password") || "";

  const filename =
    response.headers.get("X-Export-Filename") ||
    "IANETL-2026-Export.xlsx";

  return {
    blob,
    password,
    filename,
  };
};



export const getProceedings = () =>
  request(`${API_BASE_URL}/proceedings`);

export const launchProceedings = async (token) => {
  return request(`${API_BASE_URL}/proceedings/launch`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

