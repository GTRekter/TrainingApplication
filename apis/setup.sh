#!/bin/bash

set -e

# Function to execute SQL files in a given directory
execute_sql_files() {
    local dir=$1
    local db_host=$2
    local db_user=$3
    local db_password=$4

    echo "Running migrations in directory: $dir"
    find "$dir" -name "*.sql" | while read sql_file; do
        echo "Executing $sql_file"
        mysql -h "$db_host" -u "$db_user" -p"$db_password" < "$sql_file"
    done
}

# Loop through each API directory
echo "Checking version of MySQL..."
/c/tools/mysql/current/bin/mysql --version
echo "Executing database migrations for all APIs..."
for service_dir in $(find . -maxdepth 1 -type d -name '*'); do
    echo "Checking $service_dir"
    if [ -f "$service_dir/src/.env" ]; then
        echo "Loading environment variables from $service_dir/src/.env"
        source "$service_dir/src/.env"
        
        # Check if migrations directory exists
        if [ -d "$service_dir/database" ]; then
            execute_sql_files "$service_dir/database" "$DB_HOST" "$DB_USER" "$DB_PASSWORD"
        else
            echo "No migrations directory found in $service_dir"
        fi
    fi
done

echo "All database migrations have been executed successfully."