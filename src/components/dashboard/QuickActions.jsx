'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiRefreshCw, FiDownload, FiPlus, FiSettings, 
  FiBell, FiShield, FiActivity, FiUsers
} from 'react-icons/fi';
import Link from 'next/link';
import toast from 'react-hot-toast';

const actions = [
  {
    name: 'Connect Device',
    icon: FiPlus,
    href: '/connect',
    color: 'purple',
    description: 'Add new device to monitor',
  },
  {
    name: 'Export Data',
    icon: FiDownload,
    color: 'green',
    description: 'Export device data',
    onClick: () => {
      toast.success('Export started');
    },
  },
  {
    name: 'Refresh All',
    icon: FiRefreshCw,
    color: 'blue',
    description: 'Refresh all devices',
    onClick: () => {
      window.location.reload();
    },
  },
  {
    name:
