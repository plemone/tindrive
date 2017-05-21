import os

def main():
	for i in range(500):
		os.system("touch " + str(i))

if __name__ == "__main__":
	main()