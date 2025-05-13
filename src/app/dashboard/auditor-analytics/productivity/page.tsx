"use client";

import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState, useMemo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import DownloadIcon from '@mui/icons-material/Download';

interface DataItem {
  name: string;
  label?: string;  // Optional label for backward compatibility
  value: number;
  color: string;
}

interface Metrics {
  totalCalls: number;
  unresolvedCalls: number;
  escalations: number;
}

interface CategoryData {
  metrics: Metrics;
  escalationReasons: DataItem[];
  unresolvedReasons: DataItem[];
}

interface ProductivityData {
  default: CategoryData;
  appointments: CategoryData;
  prescriptions: CategoryData;
  general: CategoryData;
  [key: string]: CategoryData;
}

type CategoryName = 'appointments' | 'prescriptions' | 'general' | 'default' | 'total';

type AgentData = CategoryData;

interface AgentDataSet {
  [key: string]: AgentData;
}

interface DummyData {
  default: CategoryData;
  appointments: CategoryData;
  prescriptions: CategoryData;
  general: CategoryData;
  [key: string]: CategoryData;
}

const productivityData: ProductivityData = {
  default: {
    metrics: {
      totalCalls: 150,
      unresolvedCalls: 18,
      escalations: 12
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 35, color: '#4caf50' },
      { name: 'Technical Issues', value: 25, color: '#ff9800' },
      { name: 'Patient Concerns', value: 20, color: '#f44336' },
      { name: 'System Limitations', value: 15, color: '#2196f3' },
      { name: 'Other', value: 5, color: '#9c27b0' }
    ],
    unresolvedReasons: [
      { name: 'Pending Information', value: 40, color: '#4caf50' },
      { name: 'Follow-up Required', value: 30, color: '#ff9800' },
      { name: 'System Issues', value: 20, color: '#f44336' },
      { name: 'Other', value: 10, color: '#2196f3' }
    ]
  },
  appointments: {
    metrics: {
      totalCalls: 180,
      unresolvedCalls: 15,
      escalations: 10
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 40, color: '#4caf50' },
      { name: 'Technical Issues', value: 20, color: '#ff9800' },
      { name: 'Patient Concerns', value: 25, color: '#f44336' },
      { name: 'System Limitations', value: 10, color: '#2196f3' },
      { name: 'Other', value: 5, color: '#9c27b0' }
    ],
    unresolvedReasons: [
      { name: 'Pending Information', value: 45, color: '#4caf50' },
      { name: 'Follow-up Required', value: 35, color: '#ff9800' },
      { name: 'System Issues', value: 15, color: '#f44336' },
      { name: 'Other', value: 5, color: '#2196f3' }
    ]
  },
  prescriptions: {
    metrics: {
      totalCalls: 120,
      unresolvedCalls: 20,
      escalations: 15
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 30, color: '#4caf50' },
      { name: 'Technical Issues', value: 30, color: '#ff9800' },
      { name: 'Patient Concerns', value: 15, color: '#f44336' },
      { name: 'System Limitations', value: 20, color: '#2196f3' },
      { name: 'Other', value: 5, color: '#9c27b0' }
    ],
    unresolvedReasons: [
      { name: 'Pending Information', value: 35, color: '#4caf50' },
      { name: 'Follow-up Required', value: 25, color: '#ff9800' },
      { name: 'System Issues', value: 25, color: '#f44336' },
      { name: 'Other', value: 15, color: '#2196f3' }
    ]
  },
  general: {
    metrics: {
      totalCalls: 100,
      unresolvedCalls: 12,
      escalations: 8
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 25, color: '#4caf50' },
      { name: 'Technical Issues', value: 35, color: '#ff9800' },
      { name: 'Patient Concerns', value: 20, color: '#f44336' },
      { name: 'System Limitations', value: 15, color: '#2196f3' },
      { name: 'Other', value: 5, color: '#9c27b0' }
    ],
    unresolvedReasons: [
      { name: 'Pending Information', value: 30, color: '#4caf50' },
      { name: 'Follow-up Required', value: 40, color: '#ff9800' },
      { name: 'System Issues', value: 20, color: '#f44336' },
      { name: 'Other', value: 10, color: '#2196f3' }
    ]
  },
  'Mayo Clinic': {
    metrics: {
      totalCalls: 150,
      unresolvedCalls: 18,
      escalations: 15
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 35, color: '#4caf50' },
      { name: 'Agent Knowledge Gaps', value: 25, color: '#2196f3' },
      { name: 'Policy Exceptions Needed', value: 15, color: '#ff9800' },
      { name: 'Billing Disputes or Confusion', value: 10, color: '#f44336' },
      { name: 'Frustrated or Upset Callers', value: 8, color: '#9c27b0' },
      { name: 'Technical Issues', value: 5, color: '#795548' },
      { name: 'Language or Accessibility Needs', value: 2, color: '#607d8b' }
    ],
    unresolvedReasons: [
      { name: 'Complex Requests', value: 30, color: '#4caf50' },
      { name: 'Agent Knowledge Gaps', value: 25, color: '#2196f3' },
      { name: 'Policy Exceptions Needed', value: 20, color: '#ff9800' },
      { name: 'Billing Disputes or Confusion', value: 15, color: '#f44336' },
      { name: 'Frustrated or Upset Callers', value: 5, color: '#9c27b0' },
      { name: 'Technical Issues', value: 3, color: '#795548' },
      { name: 'Language or Accessibility Needs', value: 2, color: '#607d8b' }
    ]
  },
  'Cleveland Clinic': {
    metrics: {
      totalCalls: 150,
      unresolvedCalls: 18,
      escalations: 15
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 35, color: '#4caf50' },
      { name: 'Agent Knowledge Gaps', value: 25, color: '#2196f3' },
      { name: 'Policy Exceptions Needed', value: 15, color: '#ff9800' },
      { name: 'Billing Disputes or Confusion', value: 10, color: '#f44336' },
      { name: 'Frustrated or Upset Callers', value: 8, color: '#9c27b0' },
      { name: 'Technical Issues', value: 5, color: '#795548' },
      { name: 'Language or Accessibility Needs', value: 2, color: '#607d8b' }
    ],
    unresolvedReasons: [
      { name: 'Complex Requests', value: 30, color: '#4caf50' },
      { name: 'Agent Knowledge Gaps', value: 25, color: '#2196f3' },
      { name: 'Policy Exceptions Needed', value: 20, color: '#ff9800' },
      { name: 'Billing Disputes or Confusion', value: 15, color: '#f44336' },
      { name: 'Frustrated or Upset Callers', value: 5, color: '#9c27b0' },
      { name: 'Technical Issues', value: 3, color: '#795548' },
      { name: 'Language or Accessibility Needs', value: 2, color: '#607d8b' }
    ]
  },
  'Johns Hopkins': {
    metrics: {
      totalCalls: 150,
      unresolvedCalls: 18,
      escalations: 15
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 35, color: '#4caf50' },
      { name: 'Agent Knowledge Gaps', value: 25, color: '#2196f3' },
      { name: 'Policy Exceptions Needed', value: 15, color: '#ff9800' },
      { name: 'Billing Disputes or Confusion', value: 10, color: '#f44336' },
      { name: 'Frustrated or Upset Callers', value: 8, color: '#9c27b0' },
      { name: 'Technical Issues', value: 5, color: '#795548' },
      { name: 'Language or Accessibility Needs', value: 2, color: '#607d8b' }
    ],
    unresolvedReasons: [
      { name: 'Complex Requests', value: 30, color: '#4caf50' },
      { name: 'Agent Knowledge Gaps', value: 25, color: '#2196f3' },
      { name: 'Policy Exceptions Needed', value: 20, color: '#ff9800' },
      { name: 'Billing Disputes or Confusion', value: 15, color: '#f44336' },
      { name: 'Frustrated or Upset Callers', value: 5, color: '#9c27b0' },
      { name: 'Technical Issues', value: 3, color: '#795548' },
      { name: 'Language or Accessibility Needs', value: 2, color: '#607d8b' }
    ]
  }
};

// Agent-specific data
const agentData: AgentDataSet = {
  'agent1': {
    metrics: {
      totalCalls: 200,
      unresolvedCalls: 20,
      escalations: 15
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 35, color: '#4caf50' },
      { name: 'Technical Issues', value: 25, color: '#ff9800' },
      { name: 'Patient Concerns', value: 20, color: '#f44336' },
      { name: 'System Limitations', value: 15, color: '#2196f3' },
      { name: 'Other', value: 5, color: '#9c27b0' }
    ],
    unresolvedReasons: [
      { name: 'Pending Information', value: 40, color: '#4caf50' },
      { name: 'Follow-up Required', value: 30, color: '#ff9800' },
      { name: 'System Issues', value: 20, color: '#f44336' },
      { name: 'Other', value: 10, color: '#2196f3' }
    ]
  },
  'agent2': {
    metrics: {
      totalCalls: 180,
      unresolvedCalls: 25,
      escalations: 18
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 30, color: '#4caf50' },
      { name: 'Technical Issues', value: 30, color: '#ff9800' },
      { name: 'Patient Concerns', value: 15, color: '#f44336' },
      { name: 'System Limitations', value: 20, color: '#2196f3' },
      { name: 'Other', value: 5, color: '#9c27b0' }
    ],
    unresolvedReasons: [
      { name: 'Pending Information', value: 35, color: '#4caf50' },
      { name: 'Follow-up Required', value: 25, color: '#ff9800' },
      { name: 'System Issues', value: 25, color: '#f44336' },
      { name: 'Other', value: 15, color: '#2196f3' }
    ]
  },
  'agent3': {
    metrics: {
      totalCalls: 220,
      unresolvedCalls: 15,
      escalations: 12
    },
    escalationReasons: [
      { name: 'Complex Requests', value: 40, color: '#4caf50' },
      { name: 'Technical Issues', value: 20, color: '#ff9800' },
      { name: 'Patient Concerns', value: 25, color: '#f44336' },
      { name: 'System Limitations', value: 10, color: '#2196f3' },
      { name: 'Other', value: 5, color: '#9c27b0' }
    ],
    unresolvedReasons: [
      { name: 'Pending Information', value: 45, color: '#4caf50' },
      { name: 'Follow-up Required', value: 35, color: '#ff9800' },
      { name: 'System Issues', value: 15, color: '#f44336' },
      { name: 'Other', value: 5, color: '#2196f3' }
    ]
  }
};

export default function ProductivityAnalytics() {
  const [dateRange, setDateRange] = useState('today');
  const [category, setCategory] = useState<CategoryName>('total');
  const [agent, setAgent] = useState('total');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Get the current data based on filters
  const currentData = useMemo(() => {
    if (agent === 'total') {
      // Calculate aggregated data across all agents
      const totalData: AgentData = {
        metrics: {
          totalCalls: 0,
          unresolvedCalls: 0,
          escalations: 0
        },
        escalationReasons: [],
        unresolvedReasons: []
      };

      // Aggregate metrics
      Object.values(agentData).forEach(agent => {
        totalData.metrics.totalCalls += agent.metrics.totalCalls;
        totalData.metrics.unresolvedCalls += agent.metrics.unresolvedCalls;
        totalData.metrics.escalations += agent.metrics.escalations;
      });

      // Aggregate escalation reasons
      const escalationMap = new Map();
      let totalEscalations = 0;
      Object.values(agentData).forEach(agent => {
        agent.escalationReasons.forEach(item => {
          const existing = escalationMap.get(item.name);
          const absoluteValue = Math.round((item.value / 100) * agent.metrics.escalations);
          totalEscalations += absoluteValue;
          if (existing) {
            escalationMap.set(item.name, existing + absoluteValue);
          } else {
            escalationMap.set(item.name, absoluteValue);
          }
        });
      });
      totalData.escalationReasons = Array.from(escalationMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round((value / totalEscalations) * 100),
        color: agentData['agent1'].escalationReasons.find(item => item.name === name)?.color || '#000000'
      }));

      // Aggregate unresolved reasons
      const unresolvedMap = new Map();
      let totalUnresolved = 0;
      Object.values(agentData).forEach(agent => {
        agent.unresolvedReasons.forEach(item => {
          const existing = unresolvedMap.get(item.name);
          const absoluteValue = Math.round((item.value / 100) * agent.metrics.unresolvedCalls);
          totalUnresolved += absoluteValue;
          if (existing) {
            unresolvedMap.set(item.name, existing + absoluteValue);
          } else {
            unresolvedMap.set(item.name, absoluteValue);
          }
        });
      });
      totalData.unresolvedReasons = Array.from(unresolvedMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round((value / totalUnresolved) * 100),
        color: agentData['agent1'].unresolvedReasons.find(item => item.name === name)?.color || '#000000'
      }));

      return totalData;
    }
    
    if (category === 'total') {
      // Calculate aggregated data across all categories
      const totalData: AgentData = {
        metrics: {
          totalCalls: 0,
          unresolvedCalls: 0,
          escalations: 0
        },
        escalationReasons: [],
        unresolvedReasons: []
      };

      // Aggregate metrics across categories
      ['appointments', 'prescriptions', 'general'].forEach(cat => {
        const catData = productivityData[cat as CategoryName];
        totalData.metrics.totalCalls += catData.metrics.totalCalls;
        totalData.metrics.unresolvedCalls += catData.metrics.unresolvedCalls;
        totalData.metrics.escalations += catData.metrics.escalations;
      });

      // Aggregate escalation reasons
      const escalationMap = new Map();
      let totalEscalations = 0;
      ['appointments', 'prescriptions', 'general'].forEach(cat => {
        const catData = productivityData[cat as CategoryName];
        catData.escalationReasons.forEach(item => {
          const existing = escalationMap.get(item.name);
          const absoluteValue = Math.round((item.value / 100) * catData.metrics.escalations);
          totalEscalations += absoluteValue;
          if (existing) {
            escalationMap.set(item.name, existing + absoluteValue);
          } else {
            escalationMap.set(item.name, absoluteValue);
          }
        });
      });
      totalData.escalationReasons = Array.from(escalationMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round((value / totalEscalations) * 100),
        color: productivityData.appointments.escalationReasons.find(item => item.name === name)?.color || '#000000'
      }));

      // Aggregate unresolved reasons
      const unresolvedMap = new Map();
      let totalUnresolved = 0;
      ['appointments', 'prescriptions', 'general'].forEach(cat => {
        const catData = productivityData[cat as CategoryName];
        catData.unresolvedReasons.forEach(item => {
          const existing = unresolvedMap.get(item.name);
          const absoluteValue = Math.round((item.value / 100) * catData.metrics.unresolvedCalls);
          totalUnresolved += absoluteValue;
          if (existing) {
            unresolvedMap.set(item.name, existing + absoluteValue);
          } else {
            unresolvedMap.set(item.name, absoluteValue);
          }
        });
      });
      totalData.unresolvedReasons = Array.from(unresolvedMap.entries()).map(([name, value]) => ({
        name,
        value: Math.round((value / totalUnresolved) * 100),
        color: productivityData.appointments.unresolvedReasons.find(item => item.name === name)?.color || '#000000'
      }));

      return totalData;
    }
    
    return agentData[agent] || productivityData[category];
  }, [category, agent]);

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

  const handleDownload = (data: DataItem[], filename: string) => {
    const csvContent = [
      ['Reason', 'Number of Calls'],
      ...data.map(item => [item.name, item.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      {/* Filters Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value as CategoryName)}
              >
                <MenuItem value="total">Total</MenuItem>
                <MenuItem value="appointments">Appointments</MenuItem>
                <MenuItem value="prescriptions">Prescriptions</MenuItem>
                <MenuItem value="general">General</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
                Resolution Rate
              </Typography>
              <Typography variant="h4" component="div">
                {Math.round(((currentData.metrics.totalCalls - currentData.metrics.unresolvedCalls) / currentData.metrics.totalCalls) * 100)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
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
                Unresolved Calls
              </Typography>
              <Typography variant="h4" component="div">
                {currentData.metrics.unresolvedCalls.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
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
                Escalations
              </Typography>
              <Typography variant="h4" component="div">
                {currentData.metrics.escalations.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Top Escalation Reasons */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Top Escalation Reasons
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(currentData.escalationReasons, 'escalation_reasons.csv')}
          >
            Download
          </Button>
        </Box>
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
            {currentData.escalationReasons.map((item: DataItem, index: number) => {
              const absoluteValue = Math.round((item.value / 100) * currentData.metrics.escalations);
              return (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {absoluteValue} ({item.value}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </Box>

      {/* Top Unresolved Reasons */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Top Unresolved Reasons
          </Typography>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleDownload(currentData.unresolvedReasons, 'unresolved_reasons.csv')}
          >
            Download
          </Button>
        </Box>
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
            {currentData.unresolvedReasons.map((item: DataItem, index: number) => {
              const absoluteValue = Math.round((item.value / 100) * currentData.metrics.unresolvedCalls);
              return (
                <Box key={index}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {absoluteValue} ({item.value}%)
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={item.value}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color,
                      },
                    }}
                  />
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
} 