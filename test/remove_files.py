import os

def main():
	for i in range(500):
		os.system("rm -f " + str(i))

if __name__ == "__main__":
	main()