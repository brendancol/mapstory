#!/usr/bin/env bash
exit_status=0

# Run end-to-end tests
./runE2ETests.sh; (( exit_status = exit_status || $? ))

# Run acceptance tests
# Dissabled acceptance tests for now.
# accept run --steps; (( exit_status = exit_status || $? ))

echo "Done running all tests."
exit $exit_status
