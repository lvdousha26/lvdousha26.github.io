import subprocess, sys

# Check opencc CLI
try:
    r = subprocess.run(['opencc', '--version'], capture_output=True, text=True)
    print(f'opencc CLI: {r.stdout.strip()}')
except:
    print('opencc CLI: not found')

# Check python packages
for mod in ['zhconv', 'opencc']:
    try:
        exec(f'import {mod}')
        print(f'{mod}: available')
    except:
        print(f'{mod}: not available')
