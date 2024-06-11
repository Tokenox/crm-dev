import React from 'react';
import { LicenseInfo } from '@mui/x-license-pro';
import Router from './routes';
import ThemeProvider from './theme';
import ScrollToTop from './components/scroll-to-top';
import { StyledChart } from './components/chart';
import { Alerts } from './components/alert/Alert';

LicenseInfo.setLicenseKey('9e17734200a964cd420488accda5490fTz01ODkyOSxFPTE3MDY4NzA0MzEyMTAsUz1wcm8sTE09c3Vic2NyaXB0aW9uLEtWPTI=');

export default function App() {
  return (
    <ThemeProvider>
      <Alerts />
      <ScrollToTop />
      <StyledChart />
      <Router />
    </ThemeProvider>
  );
}
