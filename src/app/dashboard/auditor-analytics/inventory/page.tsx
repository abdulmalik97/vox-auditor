"use client";

import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState, useMemo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

interface DataItem {
  label: string;
  value: number;
  color: string;
}

interface Metrics {
  totalCalls: number;
  appointmentScheduling: number;
  prescriptionRefill: number;
  generalInquiries: number;
}

interface DataSet {
  metrics: Metrics;
  categorization: DataItem[];
  language: DataItem[];
  duration: DataItem[];
}

type ClinicName = 'Mayo Clinic' | 'Cleveland Clinic' | 'Johns Hopkins';
type CategoryName = 'appointments' | 'prescriptions' | 'referrals' | 'billing' | 'general' | 'voicemails' | 'testresults' | 'insurance' | 'default';

interface AgentData {
  metrics: {
    totalCalls: number;
    appointmentScheduling: number;
    prescriptionRefill: number;
    generalInquiries: number;
  };
  categorization: DataItem[];
  language: DataItem[];
  duration: DataItem[];
}

interface AgentDataSet {
  [key: string]: AgentData;
}

interface DummyData {
  default: DataSet;
  appointments: DataSet;
  prescriptions: DataSet;
  referrals: DataSet;
  billing: DataSet;
  general: DataSet;
  voicemails: DataSet;
  testresults: DataSet;
  insurance: DataSet;
  [key: string]: DataSet;
}

// Agent-specific data
const agentData: AgentDataSet = {
  'agent1': {
    metrics: {
      totalCalls: 850,
      appointmentScheduling: 400,
      prescriptionRefill: 300,
      generalInquiries: 150
    },
    categorization: [
      { label: 'Appointment', value: 28, color: '#2196f3' },
      { label: 'Prescription Refill', value: 22, color: '#4caf50' },
      { label: 'Referral Intake', value: 15, color: '#ff9800' },
      { label: 'Billing/Invoice Questions', value: 12, color: '#f44336' },
      { label: 'General Inquiries', value: 10, color: '#9c27b0' },
      { label: 'Volcemails/Missed Calls', value: 6, color: '#795548' },
      { label: 'Test Results/Lab-related', value: 4, color: '#607d8b' },
      { label: 'Insurance Questions', value: 3, color: '#e91e63' }
    ],
    language: [
      { label: 'English', value: 78, color: '#2196f3' },
      { label: 'Spanish', value: 14, color: '#4caf50' },
      { label: 'Other', value: 8, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 22, color: '#4caf50' },
      { label: '2-5 min', value: 48, color: '#2196f3' },
      { label: '5-10 min', value: 22, color: '#ff9800' },
      { label: '10+ min', value: 8, color: '#f44336' }
    ]
  },
  'agent2': {
    metrics: {
      totalCalls: 920,
      appointmentScheduling: 450,
      prescriptionRefill: 320,
      generalInquiries: 150
    },
    categorization: [
      { label: 'Appointment', value: 30, color: '#2196f3' },
      { label: 'Prescription Refill', value: 25, color: '#4caf50' },
      { label: 'Referral Intake', value: 14, color: '#ff9800' },
      { label: 'Billing/Invoice Questions', value: 11, color: '#f44336' },
      { label: 'General Inquiries', value: 9, color: '#9c27b0' },
      { label: 'Volcemails/Missed Calls', value: 5, color: '#795548' },
      { label: 'Test Results/Lab-related', value: 4, color: '#607d8b' },
      { label: 'Insurance Questions', value: 2, color: '#e91e63' }
    ],
    language: [
      { label: 'English', value: 72, color: '#2196f3' },
      { label: 'Spanish', value: 18, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 18, color: '#4caf50' },
      { label: '2-5 min', value: 52, color: '#2196f3' },
      { label: '5-10 min', value: 22, color: '#ff9800' },
      { label: '10+ min', value: 8, color: '#f44336' }
    ]
  },
  'agent3': {
    metrics: {
      totalCalls: 730,
      appointmentScheduling: 350,
      prescriptionRefill: 280,
      generalInquiries: 100
    },
    categorization: [
      { label: 'Appointment', value: 27, color: '#2196f3' },
      { label: 'Prescription Refill', value: 23, color: '#4caf50' },
      { label: 'Referral Intake', value: 16, color: '#ff9800' },
      { label: 'Billing/Invoice Questions', value: 13, color: '#f44336' },
      { label: 'General Inquiries', value: 11, color: '#9c27b0' },
      { label: 'Volcemails/Missed Calls', value: 5, color: '#795548' },
      { label: 'Test Results/Lab-related', value: 3, color: '#607d8b' },
      { label: 'Insurance Questions', value: 2, color: '#e91e63' }
    ],
    language: [
      { label: 'English', value: 75, color: '#2196f3' },
      { label: 'Spanish', value: 16, color: '#4caf50' },
      { label: 'Other', value: 9, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 20, color: '#4caf50' },
      { label: '2-5 min', value: 45, color: '#2196f3' },
      { label: '5-10 min', value: 25, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  }
};

const dummyData: DummyData = {
  default: {
    metrics: {
      totalCalls: 2500,
      appointmentScheduling: 1200,
      prescriptionRefill: 800,
      generalInquiries: 500
    },
    categorization: [
      { label: 'Appointment', value: 25, color: '#2196f3' },
      { label: 'Prescription Refill', value: 20, color: '#4caf50' },
      { label: 'Referral Intake', value: 15, color: '#ff9800' },
      { label: 'Billing/Invoice Questions', value: 12, color: '#f44336' },
      { label: 'General Inquiries', value: 10, color: '#9c27b0' },
      { label: 'Volcemails/Missed Calls', value: 8, color: '#795548' },
      { label: 'Test Results/Lab-related', value: 6, color: '#607d8b' },
      { label: 'Insurance Questions', value: 4, color: '#e91e63' }
    ],
    language: [
      { label: 'English', value: 75, color: '#2196f3' },
      { label: 'Spanish', value: 15, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 25, color: '#4caf50' },
      { label: '2-5 min', value: 45, color: '#2196f3' },
      { label: '5-10 min', value: 20, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  },
  appointments: {
    metrics: {
      totalCalls: 1200,
      appointmentScheduling: 1000,
      prescriptionRefill: 100,
      generalInquiries: 100
    },
    categorization: [
      { label: 'New Appointments', value: 40, color: '#2196f3' },
      { label: 'Rescheduling', value: 30, color: '#4caf50' },
      { label: 'Cancellations', value: 20, color: '#ff9800' },
      { label: 'Follow-ups', value: 10, color: '#f44336' }
    ],
    language: [
      { label: 'English', value: 80, color: '#2196f3' },
      { label: 'Spanish', value: 12, color: '#4caf50' },
      { label: 'Other', value: 8, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 15, color: '#4caf50' },
      { label: '2-5 min', value: 50, color: '#2196f3' },
      { label: '5-10 min', value: 25, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  },
  prescriptions: {
    metrics: {
      totalCalls: 800,
      appointmentScheduling: 100,
      prescriptionRefill: 600,
      generalInquiries: 100
    },
    categorization: [
      { label: 'Refill Requests', value: 45, color: '#2196f3' },
      { label: 'Status Check', value: 25, color: '#4caf50' },
      { label: 'Delivery Issues', value: 20, color: '#ff9800' },
      { label: 'Prior Authorization', value: 10, color: '#f44336' }
    ],
    language: [
      { label: 'English', value: 70, color: '#2196f3' },
      { label: 'Spanish', value: 20, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 20, color: '#4caf50' },
      { label: '2-5 min', value: 40, color: '#2196f3' },
      { label: '5-10 min', value: 30, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  },
  referrals: {
    metrics: {
      totalCalls: 600,
      appointmentScheduling: 200,
      prescriptionRefill: 100,
      generalInquiries: 300
    },
    categorization: [
      { label: 'New Referrals', value: 45, color: '#2196f3' },
      { label: 'Status Check', value: 25, color: '#4caf50' },
      { label: 'Follow-up', value: 20, color: '#ff9800' },
      { label: 'Cancellations', value: 10, color: '#f44336' }
    ],
    language: [
      { label: 'English', value: 75, color: '#2196f3' },
      { label: 'Spanish', value: 15, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 15, color: '#4caf50' },
      { label: '2-5 min', value: 45, color: '#2196f3' },
      { label: '5-10 min', value: 30, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  },
  billing: {
    metrics: {
      totalCalls: 500,
      appointmentScheduling: 100,
      prescriptionRefill: 100,
      generalInquiries: 300
    },
    categorization: [
      { label: 'Payment Questions', value: 35, color: '#2196f3' },
      { label: 'Invoice Requests', value: 25, color: '#4caf50' },
      { label: 'Payment Plans', value: 20, color: '#ff9800' },
      { label: 'Disputes', value: 15, color: '#f44336' },
      { label: 'Other', value: 5, color: '#9c27b0' }
    ],
    language: [
      { label: 'English', value: 70, color: '#2196f3' },
      { label: 'Spanish', value: 20, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 20, color: '#4caf50' },
      { label: '2-5 min', value: 40, color: '#2196f3' },
      { label: '5-10 min', value: 30, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  },
  general: {
    metrics: {
      totalCalls: 400,
      appointmentScheduling: 100,
      prescriptionRefill: 100,
      generalInquiries: 200
    },
    categorization: [
      { label: 'General Questions', value: 40, color: '#2196f3' },
      { label: 'Information Requests', value: 30, color: '#4caf50' },
      { label: 'Complaints', value: 20, color: '#ff9800' },
      { label: 'Other', value: 10, color: '#f44336' }
    ],
    language: [
      { label: 'English', value: 65, color: '#2196f3' },
      { label: 'Spanish', value: 25, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 30, color: '#4caf50' },
      { label: '2-5 min', value: 35, color: '#2196f3' },
      { label: '5-10 min', value: 25, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  },
  voicemails: {
    metrics: {
      totalCalls: 300,
      appointmentScheduling: 50,
      prescriptionRefill: 50,
      generalInquiries: 200
    },
    categorization: [
      { label: 'Missed Calls', value: 45, color: '#2196f3' },
      { label: 'Voicemails', value: 35, color: '#4caf50' },
      { label: 'Callback Requests', value: 20, color: '#ff9800' }
    ],
    language: [
      { label: 'English', value: 80, color: '#2196f3' },
      { label: 'Spanish', value: 15, color: '#4caf50' },
      { label: 'Other', value: 5, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 40, color: '#4caf50' },
      { label: '2-5 min', value: 35, color: '#2196f3' },
      { label: '5-10 min', value: 20, color: '#ff9800' },
      { label: '10+ min', value: 5, color: '#f44336' }
    ]
  },
  testresults: {
    metrics: {
      totalCalls: 250,
      appointmentScheduling: 50,
      prescriptionRefill: 50,
      generalInquiries: 150
    },
    categorization: [
      { label: 'Results Requests', value: 40, color: '#2196f3' },
      { label: 'Status Check', value: 30, color: '#4caf50' },
      { label: 'Follow-up', value: 20, color: '#ff9800' },
      { label: 'Other', value: 10, color: '#f44336' }
    ],
    language: [
      { label: 'English', value: 75, color: '#2196f3' },
      { label: 'Spanish', value: 15, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 25, color: '#4caf50' },
      { label: '2-5 min', value: 40, color: '#2196f3' },
      { label: '5-10 min', value: 25, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  },
  insurance: {
    metrics: {
      totalCalls: 200,
      appointmentScheduling: 50,
      prescriptionRefill: 50,
      generalInquiries: 100
    },
    categorization: [
      { label: 'Coverage Questions', value: 35, color: '#2196f3' },
      { label: 'Authorization Requests', value: 25, color: '#4caf50' },
      { label: 'Claims Status', value: 20, color: '#ff9800' },
      { label: 'Network Questions', value: 15, color: '#f44336' },
      { label: 'Other', value: 5, color: '#9c27b0' }
    ],
    language: [
      { label: 'English', value: 70, color: '#2196f3' },
      { label: 'Spanish', value: 20, color: '#4caf50' },
      { label: 'Other', value: 10, color: '#ff9800' }
    ],
    duration: [
      { label: '0-2 min', value: 20, color: '#4caf50' },
      { label: '2-5 min', value: 40, color: '#2196f3' },
      { label: '5-10 min', value: 30, color: '#ff9800' },
      { label: '10+ min', value: 10, color: '#f44336' }
    ]
  }
};

export default function InventoryAnalytics() {
  const [dateRange, setDateRange] = useState('today');
  const [agent, setAgent] = useState('total');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Get the current data based on filters
  const currentData = useMemo(() => {
    // Apply date range multiplier
    const getDateRangeMultiplier = (range: string) => {
      switch (range) {
        case 'today':
          return 0.85;
        case '7days':
          return 0.88;
        case '14days':
          return 0.90;
        case '30days':
          return 1;
        default:
          return 0.92; // custom range
      }
    };

    const multiplier = getDateRangeMultiplier(dateRange);

    if (agent === 'total') {
      // Calculate aggregated data across all agents
      const totalData: AgentData = {
        metrics: {
          totalCalls: 0,
          appointmentScheduling: 0,
          prescriptionRefill: 0,
          generalInquiries: 0
        },
        categorization: [],
        language: [],
        duration: []
      };

      // Aggregate metrics
      Object.values(agentData).forEach(agent => {
        totalData.metrics.totalCalls += Math.round(agent.metrics.totalCalls * multiplier);
        totalData.metrics.appointmentScheduling += Math.round(agent.metrics.appointmentScheduling * multiplier);
        totalData.metrics.prescriptionRefill += Math.round(agent.metrics.prescriptionRefill * multiplier);
        totalData.metrics.generalInquiries += Math.round(agent.metrics.generalInquiries * multiplier);
      });

      // Aggregate categorization data with averaging
      const categorizationMap = new Map();
      const agentCount = Object.keys(agentData).length;
      
      Object.values(agentData).forEach(agent => {
        agent.categorization.forEach(item => {
          const existing = categorizationMap.get(item.label);
          if (existing) {
            categorizationMap.set(item.label, existing + item.value);
          } else {
            categorizationMap.set(item.label, item.value);
          }
        });
      });

      totalData.categorization = Array.from(categorizationMap.entries()).map(([label, value]) => ({
        label,
        value: Math.round(value / agentCount), // Average the percentages
        color: agentData['agent1'].categorization.find(item => item.label === label)?.color || '#000000'
      }));

      // Aggregate language data with averaging
      const languageMap = new Map();
      Object.values(agentData).forEach(agent => {
        agent.language.forEach(item => {
          const existing = languageMap.get(item.label);
          if (existing) {
            languageMap.set(item.label, existing + item.value);
          } else {
            languageMap.set(item.label, item.value);
          }
        });
      });

      totalData.language = Array.from(languageMap.entries()).map(([label, value]) => ({
        label,
        value: Math.round(value / agentCount), // Average the percentages
        color: agentData['agent1'].language.find(item => item.label === label)?.color || '#000000'
      }));

      // Aggregate duration data with averaging
      const durationMap = new Map();
      Object.values(agentData).forEach(agent => {
        agent.duration.forEach(item => {
          const existing = durationMap.get(item.label);
          if (existing) {
            durationMap.set(item.label, existing + item.value);
          } else {
            durationMap.set(item.label, item.value);
          }
        });
      });

      totalData.duration = Array.from(durationMap.entries()).map(([label, value]) => ({
        label,
        value: Math.round(value / agentCount), // Average the percentages
        color: agentData['agent1'].duration.find(item => item.label === label)?.color || '#000000'
      }));

      return totalData;
    }
    
    // For individual agents, apply the date range multiplier
    const agentDataWithMultiplier = {
      ...agentData[agent],
      metrics: {
        totalCalls: Math.round(agentData[agent].metrics.totalCalls * multiplier),
        appointmentScheduling: Math.round(agentData[agent].metrics.appointmentScheduling * multiplier),
        prescriptionRefill: Math.round(agentData[agent].metrics.prescriptionRefill * multiplier),
        generalInquiries: Math.round(agentData[agent].metrics.generalInquiries * multiplier)
      }
    };
    
    return agentDataWithMultiplier || dummyData.default;
  }, [agent, dateRange]);

  const handleDateRangeChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomRangeOpen(true);
    } else {
      setDateRange(value);
    }
  };

  const handleCustomRangeSubmit = () => {
    setDateRange(`${customStartDate} - ${customEndDate}`);
    setIsCustomRangeOpen(false);
  };

  return (
    <Box>

      {/* Filters Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => handleDateRangeChange(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="7days">Last 7 Days</MenuItem>
                <MenuItem value="14days">Last 2 Weeks</MenuItem>
                <MenuItem value="30days">Last Month</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Agent</InputLabel>
              <Select
                value={agent}
                label="Agent"
                onChange={(e) => setAgent(e.target.value)}
              >
                <MenuItem value="total">Total</MenuItem>
                <MenuItem value="agent1">Robert</MenuItem>
                <MenuItem value="agent2">Mia</MenuItem>
                <MenuItem value="agent3">Daniel</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Custom Date Range Dialog */}
      <Dialog open={isCustomRangeOpen} onClose={() => setIsCustomRangeOpen(false)}>
        <DialogTitle>Select Custom Date Range</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2, minWidth: '300px' }}>
            <TextField
              label="Start Date"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCustomRangeOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomRangeSubmit} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>

      {/* Metrics Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Call Metrics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography color="text.secondary" gutterBottom>
                Total Calls Audited
              </Typography>
              <Typography variant="h4" component="div">
                {currentData.metrics.totalCalls.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Call Categorization Breakdown */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Call Categorization Breakdown
        </Typography>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            {currentData.categorization.map((item, index) => {
              const absoluteValue = Math.round((item.value / 100) * currentData.metrics.totalCalls);
              return (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: '100px' }}>
                      {absoluteValue.toLocaleString()} ({item.value}%)
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </Box>

      {/* Language and Duration Distribution */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Language Distribution */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Language Distribution
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Stack spacing={2}>
              {currentData.language.map((item, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: '45px' }}>
                      {item.value}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Call Duration Distribution */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Call Duration Distribution
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
            }}
          >
            <Stack spacing={2}>
              {currentData.duration.map((item, index) => (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.label}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={item.value}
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: item.color,
                        },
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: '45px' }}>
                      {item.value}%
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 