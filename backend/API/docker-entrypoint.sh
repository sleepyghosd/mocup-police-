#!/bin/sh
set -e
 
echo "Evaluating EF migration creation..."
 
if [ -n "$MIGRATION_NAME" ]; then
  echo "Creating migration: $MIGRATION_NAME"
  cd /app/src/DAL
  dotnet tool restore
  dotnet ef migrations add "$MIGRATION_NAME" \
    --project ./DAL.csproj \
    --output-dir ../DAL/Migrations
  echo "Applying migration (Watch out for ICE agents)"
  dotnet ef database update \
    --project ./DAL.csproj 
else
  echo "No migration argument provided, skipping migration creation."
fi
unset MIGRATION_NAME #Remove the env var to allow proper startup and seeding
echo "Starting app..."
cd /app
exec dotnet API.dll