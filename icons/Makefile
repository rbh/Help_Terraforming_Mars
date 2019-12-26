TARGETS=Mars-16.png Mars-32.png Mars-57.png Mars-60.png Mars-72.png Mars-76.png Mars-114.png Mars-120.png Mars-144.png Mars-152.png Mars-180.png Mars-192.png Mars-512.png Mars-96.png

all: $(TARGETS)

Mars-%.png: Mars.png
	convert -scale $*x$* $< $@
