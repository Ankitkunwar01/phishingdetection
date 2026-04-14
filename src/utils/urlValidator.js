// URL Validation Utility
const urlValidationRules = {
  field: "url",
  label: "Website URL",
  required: true,
  trim: true,
  rules: {
    format: {
      type: "url",
      allowedProtocols: ["http", "https"],
      message: "Enter a valid URL starting with http:// or https://"
    },
    length: {
      min: 10,
      max: 200,
      message: "URL length must be between 10 and 200 characters"
    },
    domain: {
      allowIP: true,
      validTLD: true,
      maxSubdomains: 5,
      message: "Invalid or suspicious domain structure"
    },
    characters: {
      blockSpaces: true,
      blockUnicode: true,
      blockProtocols: ["ftp", "file", "javascript", "data"],
      message: "URL contains unsafe or unsupported characters"
    },
    suspiciousPatterns: {
      check: true,
      patterns: [
        "@",
        "%00",
        "%2F",
        "%3A",
        "//.*//",
        "\\.{2,}"
      ],
      message: "URL contains suspicious patterns"
    },
    keywords: {
      check: true,
      list: [
        "login",
        "verify",
        "secure",
        "account",
        "update",
        "confirm",
        "bank"
      ],
      flagOnly: true
    }
  },
  rateLimit: {
    maxRequests: 5,
    perMinute: 1,
    message: "Too many URL submissions. Please wait."
  },
  output: {
    onFail: "reject",
    onFlag: "mark_suspicious",
    onPass: "accept"
  }
};

// Track submission timestamps for rate limiting
const submissionTimestamps = [];

// Validate URL format
const isValidUrlFormat = (url) => {
  try {
    const urlObj = new URL(url);
    return urlValidationRules.rules.format.allowedProtocols.includes(urlObj.protocol.slice(0, -1));
  } catch (e) {
    return false;
  }
};

// Validate URL length
const isValidLength = (url) => {
  return url.length >= urlValidationRules.rules.length.min && 
         url.length <= urlValidationRules.rules.length.max;
};

// Validate domain structure
const isValidDomain = (url) => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    
    // Check if it's an IP address
    if (urlValidationRules.rules.domain.allowIP) {
      const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipPattern.test(hostname)) {
        return true;
      }
    }
    
    // Check subdomain count
    const subdomains = hostname.split('.').filter(part => part.length > 0);
    if (subdomains.length > urlValidationRules.rules.domain.maxSubdomains + 2) { // +2 for domain and TLD
      return false;
    }
    
    // Check for valid TLD if required
    if (urlValidationRules.rules.domain.validTLD) {
      const tld = subdomains[subdomains.length - 1];
      if (!tld || tld.length < 2) {
        return false;
      }
    }
    
    return true;
  } catch (e) {
    return false;
  }
};

// Validate characters
const hasValidCharacters = (url) => {
  // Check for spaces
  if (urlValidationRules.rules.characters.blockSpaces && url.includes(' ')) {
    return false;
  }
  
  // Check for Unicode characters
  if (urlValidationRules.rules.characters.blockUnicode) {
    // Check if URL contains non-ASCII characters
    if (!/^[\x00-\x7F]*$/.test(url)) {
      return false;
    }
  }
  
  // Check for blocked protocols
  for (const protocol of urlValidationRules.rules.characters.blockProtocols) {
    if (url.toLowerCase().startsWith(protocol + ':')) {
      return false;
    }
  }
  
  return true;
};

// Check for suspicious patterns
const hasSuspiciousPatterns = (url) => {
  if (!urlValidationRules.rules.suspiciousPatterns.check) {
    return false;
  }
  
  for (const pattern of urlValidationRules.rules.suspiciousPatterns.patterns) {
    const regex = new RegExp(pattern);
    if (regex.test(url)) {
      return true;
    }
  }
  
  return false;
};

// Check for suspicious keywords
const checkKeywords = (url) => {
  if (!urlValidationRules.rules.keywords.check) {
    return { flagged: false, keywordsFound: [] };
  }
  
  const keywordsFound = [];
  const lowerUrl = url.toLowerCase();
  
  for (const keyword of urlValidationRules.rules.keywords.list) {
    if (lowerUrl.includes(keyword.toLowerCase())) {
      keywordsFound.push(keyword);
    }
  }
  
  return {
    flagged: keywordsFound.length > 0,
    keywordsFound
  };
};

// Check rate limiting
const isRateLimited = () => {
  const now = Date.now();
  const oneMinuteAgo = now - (urlValidationRules.rateLimit.perMinute * 60 * 1000);
  
  // Remove timestamps older than 1 minute
  while (submissionTimestamps.length > 0 && submissionTimestamps[0] < oneMinuteAgo) {
    submissionTimestamps.shift();
  }
  
  // Check if we've exceeded the limit
  return submissionTimestamps.length >= urlValidationRules.rateLimit.maxRequests;
};

// Add timestamp for rate limiting
const addSubmissionTimestamp = () => {
  submissionTimestamps.push(Date.now());
};

// Main validation function
export const validateUrl = (url) => {
  // Trim URL if required
  if (urlValidationRules.trim) {
    url = url.trim();
  }
  
  // Check if URL is required
  if (urlValidationRules.required && !url) {
    return {
      isValid: false,
      errors: ['URL is required']
    };
  }
  
  const errors = [];
  let isFlagged = false;
  let keywordsFound = [];
  
  // Check rate limiting
  if (isRateLimited()) {
    return {
      isValid: false,
      errors: [urlValidationRules.rateLimit.message]
    };
  }
  
  // Format validation
  if (!isValidUrlFormat(url)) {
    errors.push(urlValidationRules.rules.format.message);
  }
  
  // Length validation
  if (!isValidLength(url)) {
    errors.push(urlValidationRules.rules.length.message);
  }
  
  // Domain validation
  if (!isValidDomain(url)) {
    errors.push(urlValidationRules.rules.domain.message);
  }
  
  // Character validation
  if (!hasValidCharacters(url)) {
    errors.push(urlValidationRules.rules.characters.message);
  }
  
  // Suspicious patterns validation
  if (hasSuspiciousPatterns(url)) {
    errors.push(urlValidationRules.rules.suspiciousPatterns.message);
  }
  
  // Keyword checking
  const keywordCheck = checkKeywords(url);
  if (keywordCheck.flagged) {
    isFlagged = true;
    keywordsFound = keywordCheck.keywordsFound;
    
    // If flagOnly is false, treat as error
    if (!urlValidationRules.rules.keywords.flagOnly) {
      errors.push(`URL contains suspicious keywords: ${keywordsFound.join(', ')}`);
    }
  }
  
  // Determine validity based on errors
  const isValid = errors.length === 0;
  
  // Return result based on validation outcome
  let outputType;
  if (!isValid) {
    outputType = urlValidationRules.output.onFail;
  } else if (isFlagged) {
    outputType = urlValidationRules.output.onFlag;
  } else {
    outputType = urlValidationRules.output.onPass;
  }
  
  return {
    isValid,
    isFlagged,
    keywordsFound,
    errors,
    outputType
  };
};

// Function to record a submission (for rate limiting)
export const recordSubmission = () => {
  addSubmissionTimestamp();
};

export default {
  validateUrl,
  recordSubmission
};