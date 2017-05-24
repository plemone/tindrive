import os

def main():
	for i in range(15):
		os.system("rm -f " + str(i))

if __name__ == "__main__":
	main()
