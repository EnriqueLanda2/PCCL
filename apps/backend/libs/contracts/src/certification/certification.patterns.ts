export const CERTIFICATION_PATTERNS = {
  CERT_FIND_ALL: 'certification.certificate.find_all',
  CERT_FIND_ONE: 'certification.certificate.find_one',
  CERT_VERIFY_FOLIO: 'certification.certificate.verify_folio',
  CERT_DOWNLOAD_PDF: 'certification.certificate.download_pdf',
  CERT_ELIGIBILITY: 'certification.certificate.eligibility',
  CERT_REQUEST_CREATE: 'certification.certificate_request.create',
  CERT_REQUEST_FIND_MINE: 'certification.certificate_request.find_mine',
  CERT_REQUEST_FIND_PENDING: 'certification.certificate_request.find_pending',
  CERT_REQUEST_APPROVE: 'certification.certificate_request.approve',
  CERT_REQUEST_REJECT: 'certification.certificate_request.reject',
  AUDIT_LIST: 'certification.audit.list',
  AUDIT_REGISTER: 'certification.audit.register',
} as const;
