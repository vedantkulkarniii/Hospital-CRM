# Environment Setup Guide

## Overview

This guide explains how to set up environment variables for the Hospital CRM project across different environments.

## Backend Environment Setup

### Development Environment

**File:** `backend/.env`

```env
# ─────────────────────────────────────────────
# Hospital CRM — Development Environment
# ─────────────────────────────────────────────

# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/hospital_crm

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this_in_production_67890
JWT_REFRESH_EXPIRES_IN=7d

# Email Service (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend CORS
CLIENT_URL=http://localhost:5173

# Redis Cache (Optional)
REDIS_URL=redis://localhost:6379
```

### Test Environment

**File:** `backend/.env` (with test values)

```env
NODE_ENV=test
PORT=5000
MONGO_URI=mongodb://localhost:27017/hospital_crm_test
JWT_SECRET=test-secret-key
JWT_REFRESH_SECRET=test-refresh-secret
```

### Production Environment

**File:** `.env.production` (Do NOT commit to Git)

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_crm
JWT_SECRET=<generate-strong-random-secret>
JWT_REFRESH_SECRET=<generate-strong-random-secret>
EMAIL_USER=noreply@hospital-crm.com
EMAIL_PASS=<app-specific-password>
CLIENT_URL=https://hospital-crm.com
REDIS_URL=redis://<redis-server>:6379
```

## Frontend Environment Setup

### Development Environment

**File:** `frontend/.env.local` (Optional - Vite reads from .env by default)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Hospital CRM
```

### Production Environment

**File:** `frontend/.env.production`

```env
VITE_API_BASE_URL=https://api.hospital-crm.com/api
VITE_APP_NAME=Hospital CRM
```

## Environment Variables Explanation

### Backend

| Variable | Purpose | Example |
|---|---|---|
| `NODE_ENV` | Environment mode | `development`, `production`, `test` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/hospital_crm` |
| `JWT_SECRET` | JWT signing secret | Strong random string (32+ chars) |
| `JWT_EXPIRES_IN` | Access token expiry | `15m`, `24h`, `7d` |
| `JWT_REFRESH_SECRET` | Refresh token secret | Strong random string (32+ chars) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d`, `30d`, `90d` |
| `EMAIL_HOST` | SMTP server | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email account | `sender@gmail.com` |
| `EMAIL_PASS` | Email password | App-specific password |
| `CLIENT_URL` | Frontend URL | `http://localhost:5173` |
| `REDIS_URL` | Redis server | `redis://localhost:6379` |

### Frontend

| Variable | Purpose | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_APP_NAME` | Application name | `Hospital CRM` |

## Setup Steps

### Backend

1. **Copy example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Update values:**
   ```bash
   # Edit .env with your local settings
   nano .env
   ```

3. **Verify setup:**
   ```bash
   npm run dev
   ```

### Frontend

1. **For development**, environment variables are optional (uses localhost defaults)

2. **For production**, create `.env.production`:
   ```bash
   cd frontend
   echo "VITE_API_BASE_URL=https://api.hospital-crm.com/api" > .env.production
   ```

## JWT Secret Generation

### Generate Strong Secrets

**Using Node.js:**
```javascript
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('hex'));
```

**Using OpenSSL:**
```bash
openssl rand -hex 32
```

**Using Python:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## Running Tests

### With Environment Variables

```bash
cd backend

# Run tests with test environment
npm test

# Run with specific env file
NODE_ENV=test npm test
```

### Environment Priorities

1. `.env` file (highest)
2. `.env.local` (if present)
3. Default values in code
4. Process environment variables

## Security Best Practices

### ✅ DO

- ✅ Use strong, random secrets (32+ characters)
- ✅ Store secrets in `.env` (NOT in Git)
- ✅ Rotate secrets regularly
- ✅ Use different secrets per environment
- ✅ Add `.env` to `.gitignore`
- ✅ Document required variables in `.env.example`

### ❌ DON'T

- ❌ Commit `.env` files to Git
- ❌ Use weak or predictable secrets
- ❌ Share secrets via email/chat
- ❌ Hardcode secrets in source code
- ❌ Use same secrets in all environments
- ❌ Push production secrets to repositories

## Troubleshooting

### Variables Not Loading

**Problem:** Environment variables are undefined in code

**Solution:**
1. Verify `.env` file exists in correct directory
2. Ensure variables are properly formatted: `KEY=value`
3. Restart the development server
4. Check for typos in variable names

### MongoDB Connection Failed

**Problem:** `MONGO_URI` not working

**Solution:**
1. Verify MongoDB is running
2. Check connection string format
3. Ensure database name matches
4. For Atlas: Verify IP whitelist

### JWT Errors

**Problem:** `secretOrPrivateKey must have a value`

**Solution:**
1. Verify `JWT_SECRET` is set in `.env`
2. Verify `.env` is in correct directory
3. Restart the server
4. Check for spaces around `=` sign

### PORT Already in Use

**Problem:** `Address already in use`

**Solution:**
```bash
# Change PORT in .env
PORT=5001

# Or kill existing process
kill -9 $(lsof -t -i:5000)
```

## Environment-Specific Configuration

### Local Development
- Use localhost for all services
- Use permissive CORS settings
- Enable verbose logging
- Use short token expiry for testing

### Staging
- Use staging database
- Enable monitoring/logging
- Use staging URLs
- Test email notifications

### Production
- Use production database
- Enable security headers
- Disable verbose logging
- Use long token expiry
- Use strong secrets
- Enable backup/recovery

## CI/CD Environment Variables

### GitHub Actions

Set secrets in repository settings:
1. Go to Settings → Secrets and variables → Actions
2. Add repository secrets:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - etc.

3. Use in workflow:
```yaml
- name: Run Tests
  env:
    MONGO_URI: ${{ secrets.MONGO_URI }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
  run: npm test
```

### Environment Parity

Keep environments aligned:
- Use same Node version
- Use same MongoDB version
- Use same dependency versions
- Document all environment variables
