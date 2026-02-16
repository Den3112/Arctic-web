# Project: Arctic Time Tracker

## Overview

A comprehensive time tracking application built with Next.js 14/15, Supabase, and Tailwind CSS. The goal is to provide a clean, efficient interface for tracking tasks, managing projects, and generating reports.

## Core Features

- **Time Tracker**: Start/Stop functionality with task name autocomplete and project selection.
- **Task Management**: Daily log with editing, manual time entry, and project grouping.
- **Project Management**: Project creation with custom colors.
- **Reports**: Period-based analytics (day/week/month) with CSV export.
- **Security**: Supabase Auth and RLS-protected data.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS 4.0.
- **Backend/Database**: Supabase (Auth, Postgres).
- **Testing**: Playwright (E2E), Vitest (Unit).
- **State Management**: React Hooks & Context API.

## Architecture Notes

- Following Clean Architecture patterns: Components, Services, Hooks, and API Client layers.
- Responsive design from Mobile-First perspective.
