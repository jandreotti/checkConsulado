# .bash_profile

# Get the aliases and functions
if [ -f ~/.bashrc ]; then
	. ~/.bashrc
fi

# User specific environment and startup programs

export BASH_ENV=${HOME}/.bashrc
#export PS1="[\u@\h \w] \\$ "
export EDITOR=mcedit
export LANG="es_ES.UTF-8"
export LC_COLLATE="C"
export LC_CTYPE="es_ES.UTF-8"
export HISTIGNORE="&:[bf]g:exit"
export HISTSIZE=10000
export HISTFILESIZE=10000
export HISTTIMEFORMAT='%F %T '
export SYSTEMD_PAGER=""

if [ -n "${SSH_USER}" ] ; then
    logger -ip auth.notice -t sshd "Llave del usuario ${SSH_USER} aceptada (${LOGNAME})."
fi
