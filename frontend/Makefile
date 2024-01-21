# Define the base command
SHADN_ADD := pnpm dlx shadcn-ui@latest add

# Add suffix
%:
	$(SHADN_ADD) $@

# Phony
.PHONY: help
help:
	@echo "Usage: make [target]"
	@echo "Available targets are determined dynamically based on the command suffix."

# Default target, which does nothing but print a message
.DEFAULT:
	@echo "Error: Unknown target. Use 'make help' for usage information."
