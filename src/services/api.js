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

export const downloadCertificate = async (certificateUrl) => {
  const downloadUrl = certificateUrl.startsWith("http")
    ? certificateUrl
    : `${BACKEND_URL}${certificateUrl}`;

  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error("Unable to download certificate");
  }

  const blob = await response.blob();

  const blobUrl = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = blobUrl;

  link.download =
    certificateUrl.split("/").pop() || "certificate.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(blobUrl);
};