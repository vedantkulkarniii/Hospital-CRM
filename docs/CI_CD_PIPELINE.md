# CI/CD Pipeline Setup — Hospital CRM

## GitHub Actions Workflow

### 1. Test & Lint Pipeline

**File:** `.github/workflows/tests.yml`

```yaml
name: Tests & Linting

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:latest
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: backend/node_modules
          key: ${{ runner.os }}-backend-${{ hashFiles('backend/package-lock.json') }}
          
      - name: Install dependencies
        run: cd backend && npm install
        
      - name: Run linter
        run: cd backend && npm run lint
        
      - name: Run tests
        run: cd backend && npm test -- --coverage
        env:
          MONGO_URI: mongodb://localhost:27017/hospital_crm_test
          JWT_SECRET: test-secret
          
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage/lcov.info

  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: frontend/node_modules
          key: ${{ runner.os }}-frontend-${{ hashFiles('frontend/package-lock.json') }}
          
      - name: Install dependencies
        run: cd frontend && npm install --legacy-peer-deps
        
      - name: Run linter
        run: cd frontend && npm run lint
        
      - name: Run tests
        run: cd frontend && npm test -- --coverage
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/lcov.info
```

### 2. Build Pipeline

**File:** `.github/workflows/build.yml`

```yaml
name: Build

on:
  push:
    branches: [ main ]

jobs:
  build-backend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: cd backend && npm install
        
      - name: Build
        run: cd backend && npm run build
        
      - name: Save build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: backend-build
          path: backend/dist

  build-frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: cd frontend && npm install --legacy-peer-deps
        
      - name: Build
        run: cd frontend && npm run build
        
      - name: Save build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist
```

### 3. Deployment Pipeline

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    needs: [build-backend, build-frontend]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download backend build
        uses: actions/download-artifact@v3
        with:
          name: backend-build
          path: backend/dist
          
      - name: Download frontend build
        uses: actions/download-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist
          
      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}
          DEPLOY_USER: ${{ secrets.DEPLOY_USER }}
        run: |
          mkdir -p ~/.ssh
          echo "$DEPLOY_KEY" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh -i ~/.ssh/deploy_key $DEPLOY_USER@$DEPLOY_HOST 'cd /app && git pull && npm install && npm run deploy'
          
      - name: Notify Slack
        uses: slackapi/slack-github-action@v1
        with:
          webhook-url: ${{ secrets.SLACK_WEBHOOK }}
          payload: |
            {
              "text": "Deployment successful! ✅",
              "blocks": [{
                "type": "section",
                "text": {
                  "type": "mrkdwn",
                  "text": "*Hospital CRM deployed to production*\nVersion: ${{ github.sha }}"
                }
              }]
            }
```

## Environment Variables for CI/CD

Add these secrets to GitHub repository:
- `MONGO_URI` - Test database URI
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh secret
- `DEPLOY_KEY` - SSH private key
- `DEPLOY_HOST` - Deployment server
- `DEPLOY_USER` - Deployment user
- `SLACK_WEBHOOK` - Slack notification webhook

## Workflow Benefits

✅ Automated testing on every push
✅ Automatic code linting
✅ Coverage reporting
✅ Automated deployment
✅ Slack notifications
✅ Build artifact storage
✅ Quick failure detection
✅ Consistent deployment process
