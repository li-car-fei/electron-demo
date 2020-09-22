from sys import argv
#from calculator.simple import SimpleCalculator


def calc(num):
    """based on the input text, return the operation result"""
    print('child python process has run')
    print(num)
    return num+'1'


if __name__ == '__main__':
    print(calc(argv[1]))
