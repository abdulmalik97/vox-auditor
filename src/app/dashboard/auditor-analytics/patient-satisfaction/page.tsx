"use client";

import { Box, Typography, Grid, Paper, FormControl, InputLabel, Select, MenuItem, Stack, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useState, useMemo } from 'react';
import LinearProgress from '@mui/material/LinearProgress';

export default function PatientSatisfaction() {
  const [dateRange, setDateRange] = useState('today');
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Base data for different time periods
  const baseData = {
    today: {
      satisfactionData: [
        { label: 'Very Satisfied', value: 45, color: '#4caf50' },
        { label: 'Satisfied', value: 35, color: '#8bc34a' },
        { label: 'Neutral', value: 12, color: '#ffc107' },
        { label: 'Dissatisfied', value: 5, color: '#ff9800' },
        { label: 'Very Dissatisfied', value: 3, color: '#f44336' },
      ]
    },
    week: {
      satisfactionData: [
        { label: 'Very Satisfied', value: 42, color: '#4caf50' },
        { label: 'Satisfied', value: 38, color: '#8bc34a' },
        { label: 'Neutral', value: 13, color: '#ffc107' },
        { label: 'Dissatisfied', value: 5, color: '#ff9800' },
        { label: 'Very Dissatisfied', value: 2, color: '#f44336' },
      ]
    },
    month: {
      satisfactionData: [
        { label: 'Very Satisfied', value: 40, color: '#4caf50' },
        { label: 'Satisfied', value: 40, color: '#8bc34a' },
        { label: 'Neutral', value: 14, color: '#ffc107' },
        { label: 'Dissatisfied', value: 4, color: '#ff9800' },
        { label: 'Very Dissatisfied', value: 2, color: '#f44336' },
      ]
    },
    custom: {
      satisfactionData: [
        { label: 'Very Satisfied', value: 43, color: '#4caf50' },
        { label: 'Satisfied', value: 37, color: '#8bc34a' },
        { label: 'Neutral', value: 13, color: '#ffc107' },
        { label: 'Dissatisfied', value: 5, color: '#ff9800' },
        { label: 'Very Dissatisfied', value: 2, color: '#f44336' },
      ]
    }
  };

  // Calculate current data based on date range
  const currentData = useMemo(() => {
    return baseData[dateRange as keyof typeof baseData];
  }, [dateRange]);

  const handleCustomDateRange = () => {
    if (customStartDate && customEndDate) {
      setDateRange('custom');
      setIsCustomRangeOpen(false);
    }
  };

  return (
    <Box>
      {/* Filters Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Date Range</InputLabel>
              <Select
                value={dateRange}
                label="Date Range"
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    setIsCustomRangeOpen(true);
                  } else {
                    setDateRange(e.target.value);
                  }
                }}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="week">Last 7 Days</MenuItem>
                <MenuItem value="month">Last 30 Days</MenuItem>
                <MenuItem value="custom">Custom Range</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Custom Date Range Dialog */}
      <Dialog open={isCustomRangeOpen} onClose={() => setIsCustomRangeOpen(false)}>
        <DialogTitle>Select Custom Date Range</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2, minWidth: '300px' }}>
            <TextField
              label="Start Date"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCustomRangeOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCustomDateRange}
            variant="contained"
            disabled={!customStartDate || !customEndDate}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      {/* Satisfaction Distribution */}
      <Box>
        <Typography variant="h6" gutterBottom>
          Satisfaction Distribution
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Resolution + Sentiment Analysis
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
            {currentData.satisfactionData.map((item, index) => (
              <Box key={index}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.value}%
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
            ))}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
} 