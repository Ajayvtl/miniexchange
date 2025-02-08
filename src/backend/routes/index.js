const express = require('express');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use('/api/dashboard', dashboardRoutes);
