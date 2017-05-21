import os
import optparse

def git_commit(details):
	details = "'" + details + "'"
	os.system("sudo git add .")
	os.system("sudo git commit -m %s" %(details))
	os.system("sudo git push")

def main():
	# OptionParser object instantiated and aliased by the variable parser
	parser = optparse.OptionParser("-m <commit>")
	# options being added to the parser object
	parser.add_option("-m", dest = "commit", type = "string", help = "commit description")
	# obtained the tuple returns a tuple containing two elements, we are only concerned with the
	# the first element options which is an object containing out variable commit which can be accessed
	(options, _) = parser.parse_args()

	if options.commit == None:
		# print the error message saying that the user failed to follow instructions
		print(parser.usage)
	else:
		# options.commit contains the variable that is passed through the command line argument
		git_commit(options.commit)

if __name__ == "__main__":
	main()