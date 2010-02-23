CLOSURE_FLAGS = --warning_level=VERBOSE --formatting=PRETTY_PRINT --compilation_level=ADVANCED_OPTIMIZATIONS
CLOSURE_EXEC = java -jar closure/compiler.jar $(CLOSURE_FLAGS)
CALCDEPS_EXEC = closure-library-read-only/closure/bin/calcdeps.py

all : min/deps.js min/breeze.js
	@echo Done

min/deps.js : dev/core/* dev/engine/*
	closure-library-read-only/closure/bin/calcdeps.py \
	  -p dev \
	  -o deps > min/deps.js

min/breeze.js : min/deps.js dev/core/* dev/engine/*
	$(CALCDEPS_EXEC) \
	  -i dev/breeze.js \
	  -p dev \
	  -p closure-library-read-only \
	  -o compiled \
	  -c closure/compiler.jar \
	  -f --warning_level=VERBOSE \
	  -f --compilation_level=ADVANCED_OPTIMIZATIONS > min/breeze.js

clean:
	@rm -f min/*
