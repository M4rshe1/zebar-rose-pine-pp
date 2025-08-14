@echo off

:LOOP
robocopy . %USERPROFILE%\.glzr\zebar\zebar-rose-pine-pp /MIR /NP /XD node_modules .git .vscode /R:3 /W:10 >nul
timeout /t 3 /nobreak
cls
goto LOOP