import os
import optparse

def git_commit(details):
	details = "'" + details + "'"
	os.system("sudo git add .")
	os.system("sudo git commit -m %s" %(details))
	os.system("sudo git push")

def main():
	parser = optparse.OptionParser("-m <commit>")
	parser.add_option("-m", dest = "commit", type = "string", help = "commit description")
	(options, args) = parser.parse_args()

	if options.commit == None:
		# print the error message saying that the user failed to follow instructions
		print(parser.usage)
	else:
		# options.commit contains the variable that is passed through the command line argument
		git_commit(options.commit)

if __name__ == "__main__":
	main()