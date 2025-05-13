"use client";

import { useState } from "react";
import { Box, Tabs, Tab, Typography } from "@mui/material";
import Header from "../Header";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auditor-tabpanel-${index}`}
      aria-labelledby={`auditor-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `auditor-tab-${index}`,
    'aria-controls': `auditor-tabpanel-${index}`,
  };
}

export default function AuditorAnalytics() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header isAuthed={true} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="auditor analytics tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Inventory" {...a11yProps(0)} />
          <Tab label="Productivity" {...a11yProps(1)} />
          <Tab label="Quality" {...a11yProps(2)} />
          <Tab label="Compliance" {...a11yProps(3)} />
          <Tab label="Patient Satisfaction Score" {...a11yProps(4)} />
          <Tab label="Agent Scorecard" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Typography variant="h5">Inventory Analytics</Typography>
        {/* Add Inventory content here */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h5">Productivity Analytics</Typography>
        {/* Add Productivity content here */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h5">Quality Analytics</Typography>
        {/* Add Quality content here */}
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography variant="h5">Compliance Analytics</Typography>
        {/* Add Compliance content here */}
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Typography variant="h5">Patient Satisfaction Score Analytics</Typography>
        {/* Add Patient Satisfaction Score content here */}
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Typography variant="h5">Agent Insights Analytics</Typography>
        {/* Add Agent Insights content here */}
      </TabPanel>
    </Box>
  );
} 