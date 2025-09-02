module.exports = {
  "ci": {
    "collect": {
      "startServerCommand": "npm start",
      "startServerReadyPattern": "Local:.*http://localhost:3000",
      "startServerReadyTimeout": 30000,
      "url": [
        "http://localhost:3000",
        "http://localhost:3000/naming-tool",
        "http://localhost:3000/pricing"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop",
        "chromeFlags": "--no-sandbox --disable-dev-shm-usage"
      }
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": [
          "error",
          {
            "minScore": 80
          }
        ],
        "categories:accessibility": [
          "error",
          {
            "minScore": 90
          }
        ],
        "categories:best-practices": [
          "error",
          {
            "minScore": 85
          }
        ],
        "categories:seo": [
          "error",
          {
            "minScore": 85
          }
        ],
        "audits:largest-contentful-paint": [
          "error",
          {
            "maxNumericValue": 2500
          }
        ],
        "audits:first-input-delay": [
          "error",
          {
            "maxNumericValue": 100
          }
        ],
        "audits:cumulative-layout-shift": [
          "error",
          {
            "maxNumericValue": 0.1
          }
        ]
      }
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./scripts/performance/lighthouse"
    }
  }
};