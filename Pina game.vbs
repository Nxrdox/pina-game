Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\ronmo\Downloads\pina game"
WshShell.Run "cmd /c npm run build && npm run electron", 0, False