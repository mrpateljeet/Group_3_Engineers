//reportebVitals.js
/*
 * File name: reportWebVitals.js
 * Description: Utility for reporting web vital metrics to a specified callback function. This file dynamically imports the web-vitals library
 * and uses it to gather key performance metrics.
 */

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
