################################### MY BASHRC FILE ################################### MY BASHRC FILE ################################### MY BASHRC FILE



# .bashrc
# From: inameiname
# Last modified: 15 October 2010
# Found through various sources (including several things by me)
# Commented out stuff is what I personally don't need,
# so use at your own risk
# Feel free to copy, share, tweak, eat, or whatever








#----- ORIGINAL CONTENT ------ ORIGINAL CONTENT ------ ORIGINAL CONTENT ------ ORIGINAL CONTENT ------ ORIGINAL CONTENT ------ ORIGINAL CONTENT ------








# ~/.bashrc: executed by bash(1) for non-login shells.
# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)
# for examples

# If not running interactively, don't do anything
[ -z "$PS1" ] && return

# don't put duplicate lines in the history. See bash(1) for more options
# don't overwrite GNU Midnight Commander's setting of `ignorespace'.
HISTCONTROL=ignoredups:ignorespace
#HISTCONTROL=$HISTCONTROL${HISTCONTROL+,}ignoredups
# ... or force ignoredups and ignorespace
#HISTCONTROL=ignoreboth

# append to the history file, don't overwrite it
shopt -s histappend

# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)
HISTSIZE=1000
HISTFILESIZE=2000

# check the window size after each command and, if necessary,
# update the values of LINES and COLUMNS.
shopt -s checkwinsize

# make less more friendly for non-text input files, see lesspipe(1)
[ -x /usr/bin/lesspipe ] && eval "$(SHELL=/bin/sh lesspipe)"

# set variable identifying the chroot you work in (used in the prompt below)
if [ -z "$debian_chroot" ] && [ -r /etc/debian_chroot ]; then
    debian_chroot=$(cat /etc/debian_chroot)
fi

# set a fancy prompt (non-color, unless we know we "want" color)
case "$TERM" in
    xterm-color) color_prompt=yes;;
esac

# uncomment for a colored prompt, if the terminal has the capability; turned
# off by default to not distract the user: the focus in a terminal window
# should be on the output of commands, not on the prompt
#force_color_prompt=yes

if [ -n "$force_color_prompt" ]; then
    if [ -x /usr/bin/tput ] && tput setaf 1 >&/dev/null; then
	# We have color support; assume it's compliant with Ecma-48
	# (ISO/IEC-6429). (Lack of such support is extremely rare, and such
	# a case would tend to support setf rather than setaf.)
	color_prompt=yes
    else
	color_prompt=
    fi
fi

if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w\$ '
fi
unset color_prompt force_color_prompt

# If this is an xterm set the title to user@host:dir
case "$TERM" in
xterm*|rxvt*)
    PS1="\[\e]0;${debian_chroot:+($debian_chroot)}\u@\h: \w\a\]$PS1"
    ;;
*)
    ;;
esac

# enable color support of ls and also add handy aliases
if [ -x /usr/bin/dircolors ]; then
    test -r ~/.dircolors && eval "$(dircolors -b ~/.dircolors)" || eval "$(dircolors -b)"
    alias ls='ls --color=auto'
    #alias dir='dir --color=auto'
    #alias vdir='vdir --color=auto'

    alias grep='grep --color=auto'
    alias fgrep='fgrep --color=auto'
    alias egrep='egrep --color=auto'
fi

# some more ls aliases
#alias ll='ls -l'
#alias la='ls -A'
#alias l='ls -CF'

# Add an "alert" alias for long running commands.  Use like so:
#   sleep 10; alert
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\s*[0-9]\+\s*//;s/[;&|]\s*alert$//'\'')"'

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# enable programmable completion features (you don't need to enable
# this, if it's already enabled in /etc/bash.bashrc and /etc/profile
# sources /etc/bash.bashrc).
if [ -f /etc/bash_completion ] && ! shopt -oq posix; then
    . /etc/bash_completion
fi











#----- CUSTOM STARTS HERE ------ CUSTOM STARTS HERE ------ CUSTOM STARTS HERE ------ CUSTOM STARTS HERE ------ CUSTOM STARTS HERE ------ CUSTOM STARTS HERE








###### MISCELLANEOUS ###### MISCELLANEOUS ###### MISCELLANEOUS ###### MISCELLANEOUS ###### MISCELLANEOUS ###### MISCELLANEOUS ###### MISCELLANEOUS ######


if [ "$PS1" ]; then	# if running interactively, then run till fi at EOF:

#source ~/.bashlocalrc	# settings that vary per workstation
OS=$(uname)	# for resolving pesky os differing switches
#umask 007




##### Bash settings #####


ulimit -S -c 0	# don't want any coredumps
set -o notify	# notify when jobs running in background terminate
#set -o nounset	# attempt to use undefined variable outputs error message and forces exit
#set -o ignoreeof	# can't c-d out of shell
#set -o xtrace	# useful for debuging
#set -o noclobber	# prevents catting over file
shopt -s cdable_vars
shopt -s cdspell
shopt -s checkhash
shopt -s checkwinsize
shopt -s cmdhist
shopt -s extglob
shopt -s histappend histreedit histverify
shopt -s no_empty_cmd_completion	# bash>=2.04 only
shopt -s sourcepath
shopt -u mailwarn

stty stop undef
stty start undef


##### Variables #####


export EDITOR="nano"
export VISUAL="gedit"
export HISTCONTROL=erasedups
export HISTSIZE=10000

if [ -d $HOME/Maildir/ ]; then
    export MAIL=$HOME/Maildir/
    export MAILPATH=$HOME/Maildir/
    export MAILDIR=$HOME/Maildir/
elif [ -f /var/mail/$USER ]; then
    export MAIL="/var/mail/$USER"
fi

if [ "$TERM" = "screen" ]; then
    export TERM=$TERMINAL
fi

#if [ "$OS" = "Linux" ]; then
#    source ~/.lscolorsrc
#elif [ "$OS" = "Darwin" ]; then
#    export LSCOLORS='gxfxcxdxbxegedabagacad'
#fi





##### PATH #####


if [ "$UID" -eq 0 ]; then
    PATH=$PATH:/usr/local:/usr/local/sbin:/usr/sbin:/sbin
fi

PATH=$PATH:$HOME/bin

#remove duplicate path entries
export PATH=$(echo $PATH | awk -F: '
{ for (i = 1; i <= NF; i++) arr[$i]; }
END { for (i in arr) printf "%s:" , i; printf "\n"; } ')

#autocomplete ssh commands
complete -W "$(echo `cat ~/.bash_history | egrep '^ssh ' | sort | uniq | sed 's/^ssh //'`;)" ssh





##### Make $HOME comfy #####


#if [ ! -d "${HOME}/bin" ]; then
#    mkdir ${HOME}/bin
#    chmod 700 ${HOME}/bin
#    echo "${HOME}/bin was missing.  I created it for you."
#fi

#if [ ! -d "${HOME}/Documents" ]; then
#    if ! [  -d "${HOME}/data" ]; then
#        mkdir ${HOME}/data
#        chmod 700 ${HOME}/data
#        echo "${HOME}/data was missing.  I created it for you."
#    fi
#fi

#if [ ! -d "${HOME}/tmp" ]; then
#    mkdir ${HOME}/tmp
#    chmod 700 ${HOME}/tmp
#    echo "${HOME}/tmp was missing.  I created it for you."
#fi





##### Startup programs #####


#if [ "$USE_SCREEN" = "Y" ]; then
#    if [ "$UID" -ne 0 ]; then
#        if [ "$SHLVL" -eq 1 ]; then
#            /usr/bin/screen -d -RR
#        fi
#    fi
#fi

#if [ -e "/usr/games/fortune" ]; then
#    echo "Fortune: "
#    /usr/games/fortune
#    echo
#fi

#if [ -e "/usr/bin/uptime" ]; then
#    echo "Uptime: ` /usr/bin/uptime`"
#fi
#echo
#~/bin/rc_sync.sh
#$HOME/bin/motd.pl





##### Color chart #####


#  Black       0;30     Dark Gray     1;30      Blue        0;34     Light Blue    1;34
#  Red         0;31     Light Red     1;31      Purple      0;35     Light Purple  1;35
#  Green       0;32     Light Green   1;32      Cyan        0;36     Light Cyan    1;36
#  Brown       0;33     Yellow        1;33      Light Gray  0;37     White         1;37
#  No color    0

red='\e[0;31m'
RED='\e[1;31m'
blue='\e[0;34m'
BLUE='\e[1;34m'
cyan='\e[0;36m'
CYAN='\e[1;36m'
green='\e[0;32m'
GREEN='\e[1;32m'
yellow='\e[0;33m'
YELLOW='\e[1;33m'
NC='\e[0m'








###### FUNCTIONS ###### FUNCTIONS ###### FUNCTIONS ###### FUNCTIONS ###### FUNCTIONS ###### FUNCTIONS ###### FUNCTIONS ###### FUNCTIONS ###### FUNCTIONS








##### X DISPLAY functions #####


function set_xtitle()
{
    if [ $TERM == "xterm" ]; then
        echo -ne "\033]0;${USER}@${HOSTNAME}: ${PWD}\007"
    fi
}



function reset_display()
{
    if [ "$SHLVL" -eq 1 ]; then
        echo $DISPLAY > $HOME/.display
    else
        if [ -e $HOME/.display ]; then
            export DISPLAY=$(cat $HOME/.display)
        fi
    fi
}



#if [ "$UID" -ne 0 ]; then
#    reset_display
#fi





##### Prompt functions #####


function host_load()
{
    THRESHOLD_LOAD=50
    COLOUR_LOW=$GREEN
    COLOUR_HIGH=$RED

    if [ $OS = "Linux" ]; then
        ONE=$(uptime | sed -e "s/.*load average: \(.*\...\),\(.*\...\),\(.*\...\)/\1/" -e "s/ //g")
    fi
    if [ $OS = "Darwin" ]; then
        ONE=$(uptime | sed -e "s/.*load averages: \(.*\...\)\(.*\...\)\(.*\...\)/\1/" -e "s/ //g")
    fi
    ONEHUNDRED=$(echo -e "scale=0 \n $ONE/0.01 \nquit \n" | bc)
    if [ $ONEHUNDRED -gt $THRESHOLD_LOAD ]
        then
            HOST_COLOR=$COLOUR_HIGH
        else
            HOST_COLOR=$COLOUR_LOW
    fi
}



short_pwd()
{
    # How many characters of the $PWD should be kept
    local pwdmaxlen=25
    # Indicate that there has been dir truncation
    local trunc_symbol=".."
    local dir=${PWD##*/}
    pwdmaxlen=$(( ( pwdmaxlen < ${#dir} ) ? ${#dir} : pwdmaxlen ))
    NEW_PWD=${PWD/#$HOME/\~}
    local pwdoffset=$(( ${#NEW_PWD} - pwdmaxlen ))
    if [ ${pwdoffset} -gt "0" ]
    then
        NEW_PWD=${NEW_PWD:$pwdoffset:$pwdmaxlen}
        NEW_PWD=${trunc_symbol}/${NEW_PWD#*/}
    fi
}



shrhist()
{
    history -a $HISTFILE
    history -n $HISTFILE
}



function power_prompt()
{
    host_load
    set_xtitle
    short_pwd
    shrhist
    if [ "$UID" -eq 0 ]; then
        PS1="[\[${HOST_COLOR}\]\t\[${NC}\]][\[${red}\]\u\[${NC}\]@\[${green}\]\H\[${NC}\]:\[${cyan}\]${NEW_PWD}\[${NC}\]]\n\\$ "
    else
        #PS1="[\[${HOST_COLOR}\]\t\[${NC}\]][\[${yellow}\]\u\[${NC}\]@\[${green}\]\H\[${NC}\]:\[${cyan}\]\w\[${NC}\]]\n\\$ "
        PS1="[\[${HOST_COLOR}\]\t\[${NC}\]][\[${yellow}\]\u\[${NC}\]@\[${green}\]\H\[${NC}\]:\[${cyan}\]${NEW_PWD}\[${NC}\]]\n\\$ "
    fi
}



function lite_prompt()
{
    set_xtitle
    short_pwd
    shrhist
    if [ "$UID" -eq 0 ]; then
        PS1="[\t][\[${red}\]\u\[${NC}\]@\[${green}\]\H\[${NC}\]:\[${cyan}\]${NEW_PWD}\[${NC}\]]\n\\$ "
    else
        #PS1="[\t][\[${yellow}\]\u\[${NC}\]@\[${green}\]\H\[${NC}\]:\[${cyan}\]\w\[${NC}\]]\ni\\$ "
        PS1="[\t][\[${yellow}\]\u\[${NC}\]@\[${green}\]\H\[${NC}\]:\[${cyan}\]${NEW_PWD}\[${NC}\]]\ni\\$ "
    fi
}



#if [ $PROMPT = "power" ]; then
#    PROMPT_COMMAND=power_prompt
#else
#    PROMPT_COMMAND=lite_prompt
#fi





##### On exit function #####


function _exit()
{
    # svn ci ~/rc/
    echo -e "${RED}Nos Vemos...${NC}"
}



trap _exit EXIT





##### ~/ functions #####


function backupsfolder()
{
    if [ -d $HOME/backups_html ]; then
        chown -R $USER:www-data $HOME/backups_html
        chmod 755 $HOME/backups_html
        find $HOME/backups_html/ -type d -exec chmod 775 {} \;
        find $HOME/backups_html/ -type f -exec chmod 664 {} \;
        chmod 755 $HOME
    fi
}



function private()
{
    find $HOME -type d -exec chmod 700 {} \;
    find $HOME -type f -exec chmod 600 {} \;
    find $HOME/bin -type f -exec chmod +x {} \;
    find $HOME/.dropbox-dist/dropbox* -type f -exec chmod +x {} \;
}



function publicfolder()
{
    if [ -d $HOME/public_html ]; then
        chown -R $USER:www-data $HOME/public_html
        chmod 755 $HOME/public_html
        find $HOME/public_html/ -type d -exec chmod 775 {} \;
        find $HOME/public_html/ -type f -exec chmod 664 {} \;
        chmod 755 $HOME
    fi
}



function setperms()
{
    echo "setting proper permissions in ~/"
    private
    public
}



function wwwrc()
{
    alias mv="mv"
    mv -f ~/.[a-z]*.html ~/public_html/
    chmod 644 ~/public_html/.[a-z]*.html
    chown $USER:www-data ~/public_html/.[a-z]*.html
    alias mv="mv -i"
}





##### Common commands piped through grep #####


function aptg()	# debian specific.
{
    if [ $# -lt 1 ] || [ $# -gt 1 ]; then
        echo "search debian package list"
        echo "usage: aptg [program/keyword]"
    else
        apt-cache search $1 | sort | less
    fi
}



function hg()
{
    if [ $# -lt 1 ] || [ $# -gt 1 ]; then
        echo "search bash history"
        echo "usage: mg [search pattern]"
    else
        history | grep -i $1 | grep -v hg
    fi
}



function lsofg()
{
    if [ $# -lt 1 ] || [ $# -gt 1 ]; then
        echo "grep lsof"
        echo "usage: losfg [port/program/whatever]"
    else
        lsof | grep -i $1 | less
    fi
}



function psg()
{
    if [ $# -lt 1 ] || [ $# -gt 1 ]; then
        echo "grep running processes"
        echo "usage: psg [process]"
    else
        ps aux | grep USER | grep -v grep
        ps aux | grep -i $1 | grep -v grep
    fi
}





##### Random useful functions #####


function apath()
{
    if [ $# -lt 1 ] || [ $# -gt 2 ]; then
        echo "Temporarily add to PATH"
        echo "usage: apath [dir]"
    else
        PATH=$1:$PATH
    fi
}



function ii()
{
    echo -e "\n${RED}You are logged onto:$NC " ; hostname
    echo -e "\n${RED}Additionnal information:$NC " ; uname -a
    echo -e "\n${RED}Users logged on:$NC " ; w -h
    echo -e "\n${RED}Current date:$NC " ; date
    echo -e "\n${RED}Machine stat:$NC " ; uptime
    echo -e "\n${RED}Disk space:$NC " ; df -h
    echo -e "\n${RED}Memory stats (in MB):$NC " ;
    if [ "$OS" = "Linux" ]; then
        free -m
    elif [ "$OS" = "Darwin" ]; then
        vm_stat
    fi
    echo -e "\n${RED}IPs:$NC " ; ips
}



function ips()
{
    if [ "$OS" = "Linux" ]; then
        for i in $( /sbin/ifconfig | grep ^e | awk '{print $1}' | sed 's/://' ); do echo -n "$i: ";  /sbin/ifconfig $i | perl -nle'/dr:(\S+)/ && print $1'; done
    elif [ "$OS" = "Darwin" ]; then
        for i in $( /sbin/ifconfig | grep ^e | awk '{print $1}' | sed 's/://' ); do echo -n "$i: ";  /sbin/ifconfig $i | perl -nle'/inet (\S+)/ && print $1'; done
    fi
    echo -e "\n" ;
}



function length()
{
    if [ $# -lt 1 ]; then
        echo "count # of chars in arugment"
        echo "usage: length [string]"
    else
        echo -n $@ | wc -c
    fi
}



function md5()
{
    echo -n $@ | md5sum
}



function mnote()
{
    echo -e "- $* \n" >> ~/data/misc/motd_data/todo
    echo -e "- $* \n" >> ~/data/misc/motd_data/todo.perm
    ~/bin/motd.pl
}



function pw()
{
    if [ "$OS" = "Linux" ]; then
        gpg $HOME/data/misc/wallet/priv.asc
        vi -n $HOME/data/misc/wallet/priv
        gpg -ea $HOME/data/misc/wallet/priv
        wipe -f $HOME/data/misc/wallet/priv
    elif [ "$OS" = "Darwin" ]; then
        gpg $HOME/Documents/misc/wallet/priv.asc
        vi -n $HOME/Documents/misc/wallet/priv
        gpg -ea $HOME/Documents/misc/wallet/priv
        srm -f $HOME/Documents/misc/wallet/priv
    fi
}



function rot13()
{
    if [ $# -lt 1 ] || [ $# -gt 1 ]; then
        echo "Seriously?  You don't know what rot13 does?"
    else
        echo $@ | tr A-Za-z N-ZA-Mn-za-m
    fi
}



function rr()
{
    for i in $(ls -Rl@ | grep '^    ' | awk '{print $1}' | sort -u); \
       do echo Removing $i ... >&2;  \
       find . | xargs xattr -d $i 2>/dev/null ; done
}



function slak()
{
    if [ $# -lt 2 ]; then
        echo "add public key to securelink server"
        echo "usage: skak [accountname] [sl port]"
    else
        cat /Volumes/Library/ssh/id_rsa-$1.pub | ssh -q lila@localhost -p $2 "if [ ! -d ~/.ssh/ ] ; then mkdir ~/.ssh ; fi ; chmod 700 ~/.ssh/ ; cat - >> ~/.ssh/authorized_keys ; chmod 600 ~/.ssh/authorized_keys"
    fi
}



function slssh()
{
    if [ $# -lt 1 ]; then
        echo "connect to securelink ssh session"
        echo "usage slssh [port#]"
        echo "ssh -p \$1 localhost"
    else
        ssh -p $1 localhost
    fi
}



function slpg()
{
    if [ $# -lt 1 ]; then
        echo "create securelink ssh tunnel for postgres"
        echo "usage: slpg [port#]"
        echo "ssh -N localhost -L 2345/localhost/5432 -p \$1"
    else
        ssh -N localhost -L 2345/localhost/5432 -p $1
    fi
}



function sshpg()
{
    if [ $# -lt 1 ]; then
        echo "create ssh tunnel for postgres"
        echo "usage: sshpg username@server"
        echo "ssh -N \$1 -L 2345/localhost/5432"
    else
        ssh -N $1 -L 2345/localhost/5432
    fi
}



function sshpg2()
{
    if [ $# -lt 1 ]; then
        echo "create ssh tunnel for postgres"
        echo "usage: sshpg username@server"
        echo "ssh -N \$1 -L \$2/localhost/5432"
    else
        ssh -N $1 -L $2/localhost/5432
    fi
}





##### More random useful functions #####


##### Inserts a flag with the specified content

# Usage: flag "comment"
# If no comment, inserts the date.
function flag(){
    if [ "$1" == "" ];
    then
        echo -e  "\e[0;31m[====== " `date +"%A %e %B %Y"`, `date +"%H"`h`date +"%M"` " ======]\e[0m"
    else
        echo -e  "\e[0;31m[====== " $@ " ======]\e[0m"
    fi
}



##### Inserts a flag and executes the command

# Example: flagcommand ls
function flagcommand(){
    if [ "$1" == "" ];
    then
        return
    else
        flag $@
        $@
    fi
}



##### Weather by us zip code - Can be called two ways # weather 50315 # weather "Des Moines"

weather ()
{
declare -a WEATHERARRAY
WEATHERARRAY=( `lynx -dump http://google.com/search?q=weather+$1 | grep -A 5 '^ *Weather for' | grep -v 'Add to'`)
echo ${WEATHERARRAY[@]}
}



##### Stock prices - can be called two ways. # stock novl  (this shows stock pricing)  #stock "novell"  (this way shows stock symbol for novell)

stock ()
{
stockname=`lynx -dump http://finance.yahoo.com/q?s=${1} | grep -i ":${1})" | sed -e 's/Delayed.*$//'`
stockadvise="${stockname} - delayed quote."
declare -a STOCKINFO
STOCKINFO=(` lynx -dump http://finance.yahoo.com/q?s=${1} | egrep -i "Last Trade:|Change:|52wk Range:"`)
stockdata=`echo ${STOCKINFO[@]}`
   if [[ ${#stockname} != 0 ]] ;then
      echo "${stockadvise}"
      echo "${stockdata}"
         else
         stockname2=${1}
         lookupsymbol=`lynx -dump -nolist http://finance.yahoo.com/lookup?s="${1}" | grep -A 1 -m 1 "Portfolio" | grep -v "Portfolio" | sed 's/\(.*\)Add/\1 /'`
            if [[ ${#lookupsymbol} != 0 ]] ;then
            echo "${lookupsymbol}"
               else
               echo "Sorry $USER, I can not find ${1}."
            fi
   fi
}



##### Translate a Word  - USAGE: translate house spanish	# See dictionary.com for available languages (there are many).

translate ()
{
TRANSLATED=`lynx -dump "http://translate.reference.com/browse/${1}" | grep -i -m 1 -w "${2}:" | sed 's/^[ \t]*//;s/[ \t]*$//'`
if [[ ${#TRANSLATED} != 0 ]] ;then
   echo "\"${1}\" in ${TRANSLATED}"
   else
   echo "Sorry, I can not translate \"${1}\" to ${2}"
fi
}



##### Define a word - USAGE: define dog

define ()
{
lynx -dump "http://www.google.com/search?hl=en&q=define%3A+${1}&btnG=Google+Search" | grep -m 3 -w "*"  | sed 's/;/ -/g' | cut -d- -f1 > /tmp/templookup.txt
         if [[ -s  /tmp/templookup.txt ]] ;then
            until ! read response
               do
               echo "${response}"
               done < /tmp/templookup.txt
            else
               echo "Sorry $USER, I can't find the term \"${1} \""
         fi
rm -f /tmp/templookup.txt
}



##### Dirsize - finds directory sizes and lists them for the current directory

dirsize ()
{
du -shx * .[a-zA-Z0-9_]* 2> /dev/null | \
egrep '^ *[0-9.]*[MG]' | sort -n > /tmp/list
egrep '^ *[0-9.]*M' /tmp/list
egrep '^ *[0-9.]*G' /tmp/list
rm /tmp/list
}



##### Myip - finds your current IP if your connected to the internet

myip ()
{
lynx -dump -hiddenlinks=ignore -nolist http://checkip.dyndns.org:8245/ | awk '{ print $4 }' | sed '/^$/d; s/^[ ]*//g; s/[ ]*$//g'
}



##### Clock - A bash clock that can run in your terminal window.

clock ()
{
while true;do clear;echo "===========";date +"%r";echo "===========";sleep 1;done
}



##### Netinfo - shows network information for your system

netinfo ()
{
echo "--------------- Network Information ---------------"
/sbin/ifconfig | awk /'inet addr/ {print $2}'
/sbin/ifconfig | awk /'Bcast/ {print $3}'
/sbin/ifconfig | awk /'inet addr/ {print $4}'
/sbin/ifconfig | awk /'HWaddr/ {print $4,$5}'
myip=`lynx -dump -hiddenlinks=ignore -nolist http://checkip.dyndns.org:8245/ | sed '/^$/d; s/^[ ]*//g; s/[ ]*$//g' `
echo "${myip}"
echo "---------------------------------------------------"
}



##### Shot - takes a screenshot of your current window

shot ()
{
import -frame -strip -quality 75 "$HOME/$(date +%s).png"
}



##### Bu - Back Up a file. Usage "bu filename.txt"

bu () { cp $1 ${1}-`date +%Y%m%d%H%M`.backup ; }



##### :h gets you to the vim help menu or directly to :help wordname

:h() {  vim --cmd ":silent help $@" --cmd "only"; }


##### Add color & formatting to CLI
#export PS1="\[\e[35;1m\]\u\[\e[0m\]\[\e[32m\]@\h\[\e[32m\]\w \[\e[33m\]\$ \[\e[0m\]"
export PS1="\[\e[33;1m\]\u\[\e[0m\]\[\e[32m\]@\h\[\e[32m\]\w \[\e[33m\]\$ \[\e[0m\]"
#export PS1="\[\033[0;33m\][\!]\`if [[ \$? = "0" ]]; then echo "\\[\\033[1\\\;32m\\]"; else echo "\\[\\033[1\\\;31m\\]"; fi\`[\u:\`if [[ `pwd|wc -c|tr -d " "` > 18 ]]; then echo "\\W"; else echo "\\w"; fi\`]\$\[\033[0m\] "; echo -ne "\033]0;`hostname -s`:`pwd`\007"



##### Makes directory then moves into it

function mkcdr {
    mkdir -p -v $1
    cd $1
}



##### Creates an archive from given directory

mtar() { tar cvf  "${1%%/}.tar"     "${1%%/}/"; }
mktgz() { tar cvzf "${1%%/}.tar.gz"  "${1%%/}/"; }
mktbz() { tar cvjf "${1%%/}.tar.bz2" "${1%%/}/"; }



##### To show Apt Log History

function apt-history(){
      case "$1" in
        install)
              cat /var/log/dpkg.log | grep 'install '
              ;;
        upgrade|remove)
              cat /var/log/dpkg.log | grep $1
              ;;
        rollback)
              cat /var/log/dpkg.log | grep upgrade | \
                  grep "$2" -A10000000 | \
                  grep "$3" -B10000000 | \
                  awk '{print $4"="$5}'
              ;;
        *)
              cat /var/log/dpkg.log
              ;;
      esac
}



##### Reminder for whatever whenever

function remindme()
{
sleep $1 && zenity --info --text "$2" &
}



##### Kill a process by name

# Example: killps firefox-bin
function killps()
{
    local pid pname sig="-TERM" # default signal
    if [ "$#" -lt 1 ] || [ "$#" -gt 2 ]; then
        echo "Usage: killps [-SIGNAL] pattern"
        return;
    fi
    if [ $# = 2 ]; then sig=$1 ; fi
    for pid in $(myps | nawk '!/nawk/ && $0~pat { print $2 }' pat=${!#}) ; do
        pname=$(myps | nawk '$2~var { print $6 }' var=$pid )
        if ask "Kill process $pid <$pname> with signal $sig ? "
            then kill $sig $pid
        fi
    done
}



##### Ask

function ask()
{
    echo -n "$@" '[y/n] ' ; read ans
    case "$ans" in
        y*|Y*) return 0 ;;
        *) return 1 ;;
    esac
}



##### User friendly ps

function psaux() {
    [ $# == 1 ] && ps aux | grep $1
}



function my_ps() { ps $@ -u $USER -o pid,%cpu,%mem,bsdtime,command ; }



function pp() { my_ps f | awk '!/awk/ && $0~var' var=${1:-".*"} ; }



##### Change directory and list files

function cds(){
    # only change directory if a directory is specified
    [ -n "${1}" ] && cd $1
    lls
}



##### Advanced ls function

# Counts files, subdirectories and directory size and displays details
# about files depending on the available space
function lls () {
	# count files
	echo -n "<`find . -maxdepth 1 -mindepth 1 -type f | wc -l | tr -d '[:space:]'` files>"
	# count sub-directories
	echo -n " <`find . -maxdepth 1 -mindepth 1 -type d | wc -l | tr -d '[:space:]'` dirs/>"
	# count links
	echo -n " <`find . -maxdepth 1 -mindepth 1 -type l | wc -l | tr -d '[:space:]'` links@>"
	# total disk space used by this directory and all subdirectories
	echo " <~`du -sh . 2> /dev/null | cut -f1`>"
	ROWS=`stty size | cut -d' ' -f1`
	FILES=`find . -maxdepth 1 -mindepth 1 |
	wc -l | tr -d '[:space:]'`
	# if the terminal has enough lines, do a long listing
	if [ `expr "${ROWS}" - 6` -lt "${FILES}" ]; then
		ls
	else
		ls -hlAF --full-time
	fi
}



##### Find a file with a pattern in name in the local directory

function fp()
{
    find . -type f -iname '*'$*'*' -ls ;
}



##### Find a file with pattern $1 in name and Execute $2 on it

function fe() { find . -type f -iname '*'$1'*' -exec "${2:-file}" {} \;  ; }



##### Find pattern in a set of files and highlight them

function fstr()
{
    OPTIND=1
    local case=""
    local usage="fstr: find string in files.
Usage: fstr [-i] \"pattern\" [\"filename pattern\"] "
    while getopts :it opt
    do
        case "$opt" in
        i) case="-i " ;;
        *) echo "$usage"; return;;
        esac
    done
    shift $(( $OPTIND - 1 ))
    if [ "$#" -lt 1 ]; then
        echo "$usage"
        return;
    fi
    local SMSO=$(tput smso)
    local RMSO=$(tput rmso)
    find . -type f -name "${2:-*}" -print0 | xargs -0 grep -sn ${case} "$1" 2>&- | \
sed "s/$1/${SMSO}\0${RMSO}/gI" | more
}



##### Cut last n lines in file, 10 by default

function cuttail()
{
    nlines=${2:-10}
    sed -n -e :a -e "1,${nlines}!{P;N;D;};N;ba" $1
}



##### Move filenames to lowercase

function lowercase()
{
    for file ; do
        filename=${file##*/}
        case "$filename" in
        */*) dirname==${file%/*} ;;
        *) dirname=.;;
        esac
        nf=$(echo $filename | tr A-Z a-z)
        newname="${dirname}/${nf}"
        if [ "$nf" != "$filename" ]; then
            mv "$file" "$newname"
            echo "lowercase: $file --> $newname"
        else
            echo "lowercase: $file not changed."
        fi
    done
}



##### Creates a backup of the file passed as parameter with the date and time

function bak ()
{
  cp $1 $1_`date +%H:%M:%S_%d-%m-%Y`
}



##### Swap 2 filenames around

function swap()
{
    local TMPFILE=tmp.$$
    mv "$1" $TMPFILE
    mv "$2" "$1"
    mv $TMPFILE "$2"
}



##### Edit the svn log at  the given revision

editsvnlog() {
    svn propedit svn:log --revprop -r$1 --editor-cmd gedit
}



##### Remove all files created by latex

function unlatex(){
if [ "$1" == "" ]; then
return
fi
i=${1%%.*}
rm -f $i.aux $i.toc $i.lof $i.lot $i.los $i.?*~ $i.loa $i.log $i.bbl $i.blg $i.glo
rm -f $i.odt $i.tns $i.fax $i.bm $i.out $i.nav $i.snm
rm -f $i.mtc* $i.bmt
mv -f $i.dvi .$i.dvi
mv -f $i.ps .$i.ps
mv -f $i.pdf .$i.pdf
rm -f $i.dvi $i.ps $i.pdf
unset i
}



##### Display private IP

function ippriv()
{
    ifconfig $1|grep "Direc. inet"|awk '{print $2}'|awk -F ':' '{print $2}'
}



##### Repeats a command every x seconds

# Usage: repeat PERIOD COMMAND
function repeat() {
    local period
    period=$1; shift;
    while (true); do
        eval "$@";
    sleep $period;
    done
}



##### Size of directories in MB

function ds()
{
    echo "size of directories in MB"
    if [ $# -lt 1 ] || [ $# -gt 2 ]; then
        echo "you did not specify a directy, using pwd"
        DIR=$(pwd)
        find $DIR -maxdepth 1 -type d -exec du -sm \{\} \; | sort -nr
    else
        find $1 -maxdepth 1 -type d -exec du -sm \{\} \; | sort -nr
    fi
}



##### Automatically inputs aliases here in '.bashrc'

# Usage: mkalias <name> "<command>"
# Example: mkalias rm "rm -i"
function mkalias ()
{
        if [[ $1 && $2 ]]
        then
        echo -e "alias $1=\"$2\"" >> ~/.bashrc
        alias $1=$2
        fi
}



##### Copy & paste files and folders from the command line

# Usage: "ccopy FILE/FOLDER#1 FILE/FOLDER#2 FILE/FOLDER#3 FILE/FOLDER#4 ..."
# Note: You must 'cd' into the folder first ("whatever" works, while "~/myfolder/whatever" doesn't)
ccopy(){ for i in $*; do cp -a $i /tmp/ccopy.$i; done }
alias cpaste="ls -d /tmp/ccopy* | sed 's|[^\.]*.\.||' | xargs -I % mv /tmp/ccopy.% ./%"








###### ALIASES ###### ALIASES ###### ALIASES ###### ALIASES ###### ALIASES ###### ALIASES ###### ALIASES ###### ALIASES ###### ALIASES ###### ALIASES ######








##### Directory shortcuts

alias home='cd ~/'
alias backgrounds='cd ~/Pictures/Backgrounds'
alias backups='cd ~/Backups'
alias books='cd ~/eBooks'
alias documents='cd ~/Documents'
alias downloads='cd ~/Downloads'
alias drive-c='cd ~/.wine/drive_c'
alias images='cd ~/Images'
alias localhost='cd /var/www'
alias music='cd ~/Music'
alias nautilus-scripts='cd ~/.gnome2/nautilus-scripts'
alias packages='cd ~/Packages'
alias pictures='cd ~/Pictures'
alias ppc='cd ~/PPC'
alias public='cd ~/Public'
alias torrents='cd ~/Torrents'
alias temp='cd ~/Temp'
alias ubuntu-texts='cd ~/Documents/Ubuntu Texts'
alias videos='cd ~/Videos'
alias webdesign='cd ~/Web/Design'
alias back='cd $OLDPWD'
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ......='cd ../../../../..'



##### Command substitution

alias ff='sudo find / -name $1'
alias df='df -h -x tmpfs -x usbfs'
alias h='history | grep $1'
#alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias which='type -all'
alias path='echo -e ${PATH//:/\\n}'
alias vi='vim'
alias ve='vi ~/.vimrc'
alias tc='tar cfvz'
alias tx='tar xfvz'
alias du='du -h --max-depth=1'
alias sdu='sudo du -h --max-depth=1'
alias c='clear'
#alias e='espeak'
alias e='geany'
alias me='vi ~/.muttrc'
alias enote='vi ~/data/misc/motd_data/todo;~/bin/motd.pl'
alias logs='tail -f /var/log/messages /var/log/*log'
alias m='~/bin/motd.pl'
alias pe='vi ~/.procmailrc'
alias rcci='svn ci ~/rc/'
alias rcup='~/bin/rc_sync.sh'
#alias se='vi ~/.screenrc'
alias se='sudo geany'
alias sr='screen -d -RR'
alias kgp='killall gnome-panel'
alias k='kill'
alias kn='killall nautilus'
alias q='exit'
alias n='nautilus .'
alias na='nautilus '
alias nq='nautilus -q'
alias yt='youtube-dl -t '
#alias mc='metacafe-dl -t'
alias updatefont='fc-cache -v -f'
alias sdi='sudo dpkg -i'
alias ps='ps auxf'
alias pg='ps aux | grep'*	# requires an argument
alias mountedinfo='df -hT'
#alias ping='ping -c 10'
alias mkdir='mkdir -p -v'
alias scpresume='rsync --partial --progress --rsh=ssh'
alias openports='netstat -nape --inet'
alias ns='netstat -alnp --protocol=inet | grep -v CLOSE_WAIT | cut -c-6,21-94 | tail +2'
alias du1='du -h --max-depth=1'
alias du2='du --all --human-readable --one-file-system --max-depth=1'
alias du3='du -ahx --max-depth=1 $1 | sort -k1 -rh'
alias packup='/bin/tar -czvf'	# compress a file in tar format
alias unpack='/bin/tar -xzvpf'	# uncompress a a Tar file
alias contents='/bin/tar -tzf'	# can View the contents of a Tar file
alias mktd='tdir=`mktemp -d` && cd $tdir'	# make a temp dir, then immediately cd into it
### some ls aliases
alias ls='ls -hF --color'	# add colors for filetype recognition
alias lx='ls -lXB'	# sort by extension
alias lk='ls -lSr'	# sort by size
alias la='ls -Al'	# show hidden files
alias lr='ls -lR'	# recursice ls
alias lt='ls -ltr'	# sort by date
alias lm='ls -al |more'	# pipe through 'more'
alias tree='tree -Cs'	# nice alternative to 'ls'
alias ll='ls -l'	# long listing
alias l='ls -hF --color'	# quick listing
alias lsize='ls --sort=size -lhr'	# list by size
alias l?='cat ~/technical/tips/ls'
alias lsd='ls -l | grep "^d"'	# list only directories
alias l.='ls -d .[[:alnum:]]* 2> /dev/null || echo "No hidden file here..."'	# list only hidden files



##### Miscellaneous

alias edit='nano'
alias bashrc='gedit ~/.bashrc & exit'
alias bashrc-root='sudo gedit ~/.bashrc & exit'
alias bashrc-copy='sudo cp ~/.bashrc /root/.bashrc'
alias ebrc='nano ~/.bashrc'
alias ebrcupdate='source ~/.bashrc'
alias repo='gksudo gedit /etc/apt/sources.list'
alias showrepo='cat /etc/apt/sources.list `ls /etc/apt/sources.list.d/*.list` | egrep -v "^$"'
alias addrepo='sudo add-apt-repository'	# add a repo to repo .list
alias addkey='sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys'
alias ugrub='sudo update-grub'	# update grub
alias ugrub2='sudo update-grub2'	# update grub2
alias service='sudo service'	# access a system service
alias n2r='sudo /etc/init.d/nginx stop && sleep 2 && sudo /etc/init.d/nginx start'
alias someDBdump='sudo mysqldump someDB -uroot -p > $HOME/www/_dbs/someDB.sql'
alias webshare='python -c "import SimpleHTTPServer; SimpleHTTPServer.test();"'
alias wiki='wikipedia2text -p'
alias perm='stat --printf "%a %n \n "'
alias bbc='lynx -term=vt100 http://news.bbc.co.uk/text_only.stm'
alias nytimes='lynx -term=vt100 http://nytimes.com'
alias ip='curl www.whatismyip.org'
alias restart-apache='sudo /etc/init.d/apache2 restart'
alias svnrmallentries='find . -name .svn -print0 | xargs -0 rm -rf'	# remove all .svn directories recursively
alias svnaddall='find "$PWD" -exec svn add {} 2>/dev/null \;'	# add all files recursively
alias starwars='telnet towel.blinkenlights.nl'
alias mencoder-join='mencoder -forceidx -ovc copy -oac copy -o'	# just add: whatever.avi whatever.pt1.avi whatever.pt2.avi ...
### easy script callin'
alias show-info='~/.bin/info.pl'
alias show-colors='~/.bin/colors.sh'
### sudo fixes
alias updatedb='sudo updatedb'
alias ppa-purge='sudo ppa-purge'
### terminal notifications
alias alert_helper='history|tail -n1|sed -e "s/^\s*[0-9]\+\s*//" -e "s/;\s*alert$//"'
alias alert='notify-send -i gnome-terminal "Finished Terminal Job" "[$?] $(alert_helper)"'
### truecrypt
alias mtrue='sudo truecrypt /media/usbdisk/$USER.tc ~/$USER'
alias utrue='sudo truecrypt -d'
### rsync
alias usbb='rsync -avz /media/usbdisk/ ~/backup/usb/'
alias rsync-me='sudo rsync -a -v --progress --delete --modify-window=1 -s $HOME /home/rsync'



##### Chmod commands

alias mx='chmod a+x'
alias 000='chmod 000'
alias 644='chmod 644'
alias 755='chmod 755'



##### App-specific

# alias nano='nano -W -m'
alias audio='ncmpcpp'
alias ftp='ncftp Personal'
alias wget='wget -c'
alias scrot='scrot -c -d 7'
alias tvtime-video0='tvtime-configure -d /dev/video0'
alias tvtime-video1='tvtime-configure -d /dev/video1'
alias tvtime-video2='tvtime-configure -d /dev/video2'
alias tvtime-video3='tvtime-configure -d /dev/video3'
alias tvtime-video4='tvtime-configure -d /dev/video4'
alias tvtime-video5='tvtime-configure -d /dev/video5'
alias ss='gnome-screensaver-command -a'



##### Xterm and Aterm

alias term='xterm -bg AntiqueWhite -fg Black &'
alias termb='xterm -bg AntiqueWhite -fg NavyBlue &'
alias termg='xterm -bg AntiqueWhite -fg OliveDrab &'
alias termr='xterm -bg AntiqueWhite -fg DarkRed &'
alias aterm='xterm -ls -fg gray -bg black'
alias xtop='xterm -fn 6x13 -bg LightSlateGray -fg black -e top &'
alias xsu='xterm -fn 7x14 -bg DarkOrange4 -fg white -e su &'



##### Remote hosts and proxy stuff

alias remote='ssh -p 1234 12.34.56.78'	# access some remote host
alias uploads='cd /some/folder'	# access some folder
alias dbdumpcp='scp -P 1234 username@12.34.56.78:$HOME/Backup/www/data/someSite/db.sql $HOME/Backup/data/db.sql'	# copy remote db to local
alias proxy1='ssh -p 1234 -D 5678 username@12.34.56.78'	# SOCKS proxy .. these anonomise my browsing with a single word - 12.34.56.78
alias proxy2='ssh -p 8765 -D 4321 username@87.65.43.21'	# SOCKS proxy .. these anonomise my browsing with a single word - 87.65.43.21
alias sync='java -jar ~/finchsync/finchsync.jar -nogui'	# sync to PDA .. well, that'll be a sync then! - start FinchSync SVR
alias syncoff='java -jar ~/Apps/FinchSync/finchsync.jar -stopserver'	# sync to PDA .. well, that'll be a sync then! - stop FinchSync SVR
alias finchsync='java -jar ~/finchsync/finchsync.jar'	# start FinchSync Admin



##### Information

alias ver='cat /etc/lsb-release'	# Ubuntu version detail
alias version='sudo apt-show-versions'	# show version
alias space='df -h'	# disk space usage
alias free='free -m'	# RAM and SWAP detail in MBs
alias hardware='sudo lshw -html > hardware.html'	# overview of the hardware in the computer
alias hgrep='history | grep --color=always'	# search commands history
alias top-commands='history | awk "{print $2}" | awk "BEGIN {FS="|"} {print $1}" |sort|uniq -c | sort -rn | head -10'	# show most popular commands
alias biggest='BLOCKSIZE=1048576; du -x | sort -nr | head -10'	# show biggest directories
alias topten='du -sk $(/bin/ls -A) | sort -rn | head -10'	# displays the top ten biggest folders/files in the current directory
alias treefind="find . | sed 's/[^/]*\//|   /g;s/| *\([^| ]\)/+--- \1/'"	# displays a tree of the arborescence
alias stamp='date "+%Y%m%d%a%H%M"'	# timestamps
alias da='date "+%Y-%m-%d %A    %T %Z"'
alias today='date +"%A, %B %-d, %Y"'
alias myps='/bin/ps -u "$USER" -o user,pid,ppid,pcpu,pmem,args|less'	# ps



##### Personal help

alias a?='cat ~/.alias.help'
alias f?='cat ~/.function.help'
alias dn='OPTIONS=$(\ls -F | grep /$); select s in $OPTIONS; do cd $PWD/$s; break;done'
alias help='OPTIONS=$(\ls ~/.tips -F);select s in $OPTIONS; do less ~/.tips/$s; break;done'



##### Computer cleanup

alias trash='rm -fr ~/.Trash'
alias orphaned='sudo deborphan | xargs sudo apt-get -y remove --purge'
alias cleanup='sudo apt-get -y autoclean && sudo apt-get -y autoremove && sudo apt-get -y clean && sudo apt-get -y remove && sudo deborphan | xargs sudo apt-get -y remove --purge'



##### Hardware Shortcuts

alias cdo='eject /dev/cdrecorder'
alias cdc='eject -t /dev/cdrecorder'
alias dvdo='eject /dev/dvd'
alias dvdc='eject -t /dev/dvd'
alias scan='scanimage -L'
alias playw='for i in *.wav; do play $i; done'
alias playo='for i in *.ogg; do play $i; done'
alias playm='for i in *.mp3; do play $i; done'
alias dvdrip='vobcopy -i /dev/dvd/ -o ~/DVDs/ -l'



##### Espeak commands

alias espeak-wav-file='espeak -s 150 -w voice.wav -f'
alias espeak-wav='espeak -s 150 -w voice.wav'
alias espeak-us='espeak -v en-us -s 150'
alias espeak-file='espeak -s 150 -f'



##### Package making and installation

alias checkinstall='sudo checkinstall -y --fstrans=no'
alias checkinstall-noinstall='sudo checkinstall -y --fstrans=no --install=no'
alias checkinstall-force='sudo checkinstall --dpkgflags "--force-overwrite"'
alias debinstall='sudo dpkg -i'
alias debinstall-force='sudo dpkg -i --force-overwrite'



##### Chown substitution

alias chown='sudo chown -R $USER:$USER'
alias chown-backgrounds='sudo chown -R $USER:$USER ~/Pictures/Backgrounds'
alias chown-backups='sudo chown -R $USER:$USER ~/Backups'
alias chown-desktop='sudo chown -R $USER:$USER ~/Desktop'
alias chown-documents='sudo chown -R $USER:$USER ~/Documents'
alias chown-music='sudo chown -R $USER:$USER ~/Music'
alias chown-pictures='sudo chown -R $USER:$USER ~/Pictures'
alias chown-ppc='sudo chown -R $USER:$USER ~/PPC'
alias chown-public='sudo chown -R $USER:$USER ~/Public'
alias chown-temp='sudo chown -R $USER:$USER ~/Temp'
alias chown-videos='sudo chown -R $USER:$USER ~/Videos'



##### Aptitude stuff

alias install='sudo aptitude install'
alias remove='sudo aptitude remove'
alias purge='sudo aptitude purge'
alias hold='sudo aptitude hold'
alias unhold='sudo aptitude unhold'
alias markauto='sudo aptitude markauto'
alias unmarkauto='sudo aptitude unmarkauto'
alias forbid-version='sudo aptitude forbid-version'
alias update='sudo aptitude update'
alias upgrade='sudo aptitude safe-upgrade'
alias full-upgrade='sudo aptitude full-upgrade'
alias build-dep='sudo aptitude build-dep'
alias forget-new='sudo aptitude forget-new'
alias search='sudo aptitude search'
alias show='sudo aptitude show'
alias clean='sudo aptitude clean'
alias autoclean='sudo aptitude autoclean'
alias changelog='sudo aptitude changelog'
alias download='sudo aptitude download'
alias reinstall='sudo aptitude reinstall'
alias why='sudo aptitude why'
alias why-not='sudo aptitude why-not'
alias linux-image='sudo aptitude search linux-image'	# linux-image kernel update check



##### Apt-get stuff

alias autoremove='sudo apt-get autoremove'
alias source='sudo apt-get source'
alias dist-upgrade='sudo apt-get dist-upgrade'
alias dselect-upgrade='sudo apt-get dselect-upgrade'
alias check='sudo apt-get check'



##### Apt-cache stuff

alias aptadd='sudo apt-cache add'
alias aptgencaches='sudo apt-cache gencaches'
alias aptshowpkg='sudo apt-cache showpkg'
alias aptshowsrc='sudo apt-cache showsrc'
alias aptstats='sudo apt-cache stats'
alias aptdump='sudo apt-cache dump'
alias aptdumpavail='sudo apt-cache dumpavail'
alias aptunmet='sudo apt-cache unmet'
alias aptsearch='sudo apt-cache search'
alias aptshow='sudo apt-cache show'
alias aptdepends='sudo apt-cache depends'
alias aptrdepends='sudo apt-cache rdepends'
alias aptpkgnames='sudo apt-cache pkgnames'
alias aptdotty='sudo apt-cache dotty'
alias aptxvcg='sudo apt-cache xvcg'
alias aptpolicy='sudo apt-cache policy'





##### Secure-delete substitution

alias srm='sudo srm -f -s -z -v'
alias srm-m='sudo srm -f -m -z -v'
alias smem-secure='sudo sdmem -v'
alias smem-f='sudo sdmem -f -l -l -v'
alias smem='sudo sdmem -l -l -v'
alias sfill-f='sudo sfill -f -l -l -v -z'
alias sfill='sudo sfill -l -l -v -z'
alias sfill-usedspace='sudo sfill -i -l -l -v'
alias sfill-freespace='sudo sfill -I -l -l -v'
alias sswap='sudo sswap -f -l -l -v -z'
alias sswap-sda5='sudo sswap -f -l -l -v -z /dev/sda5'
alias swapoff='sudo swapoff /dev/sda5'
alias swapon='sudo swapon /dev/sda5'



##### Shred substitution

alias shred-sda='sudo shred -v -z -n 0 /dev/sda'
alias shred-sdb='sudo shred -v -z -n 0 /dev/sdb'
alias shred-sdc='sudo shred -v -z -n 0 /dev/sdc'
alias shred-sdd='sudo shred -v -z -n 0 /dev/sdd'
alias shred-sde='sudo shred -v -z -n 0 /dev/sde'
alias shred-sdf='sudo shred -v -z -n 0 /dev/sdf'
alias shred-sdg='sudo shred -v -z -n 0 /dev/sdg'
alias shred-sda-r='sudo shred -v -z -n 1 /dev/sda'
alias shred-sdb-r='sudo shred -v -z -n 1 /dev/sdb'
alias shred-sdc-r='sudo shred -v -z -n 1 /dev/sdc'
alias shred-sdd-r='sudo shred -v -z -n 1 /dev/sdd'
alias shred-sde-r='sudo shred -v -z -n 1 /dev/sde'
alias shred-sdf-r='sudo shred -v -z -n 1 /dev/sdf'
alias shred-sdg-r='sudo shred -v -z -n 1 /dev/sdg'



##### DD substitution

alias backup-sda='sudo dd if=/dev/hda of=/dev/sda bs=64k conv=notrunc,noerror'	# to backup the existing drive to a USB drive
alias restore-sda='sudo dd if=/dev/sda of=/dev/hda bs=64k conv=notrunc,noerror'	# to restore from the USB drive to the existing drive
alias partitioncopy='sudo dd if=/dev/sda1 of=/dev/sda2 bs=4096 conv=notrunc,noerror'	# to duplicate one hard disk partition to another hard disk partition
alias cdiso='sudo dd if=/dev/hda of=cd.iso bs=2048 conv=sync,notrunc'	# to make an iso image of a CD
alias diskcopy='sudo dd if=/dev/dvd of=/dev/cdrecorder'
alias cdcopy='sudo dd if=/dev/cdrom of=cd.iso'	# for cdrom
alias scsicopy='sudo dd if=/dev/scd0 of=cd.iso'	# if cdrom is scsi
alias dvdcopy='sudo dd if=/dev/dvd of=dvd.iso'	# for dvd
alias floppycopy='sudo dd if=/dev/fd0 of=floppy.image'	# to duplicate a floppy disk to hard drive image file
alias dd-sda='sudo dd if=/dev/zero of=/dev/sda conv=notrunc'	# to wipe hard drive with zero
alias dd-sdb='sudo dd if=/dev/zero of=/dev/sdb conv=notrunc'	# to wipe hard drive with zero
alias dd-sdc='sudo dd if=/dev/zero of=/dev/sdc conv=notrunc'	# to wipe hard drive with zero
alias dd-sdd='sudo dd if=/dev/zero of=/dev/sdd conv=notrunc'	# to wipe hard drive with zero
alias dd-sde='sudo dd if=/dev/zero of=/dev/sde conv=notrunc'	# to wipe hard drive with zero
alias dd-sdf='sudo dd if=/dev/zero of=/dev/sdf conv=notrunc'	# to wipe hard drive with zero
alias dd-sdg='sudo dd if=/dev/zero of=/dev/sdg conv=notrunc'	# to wipe hard drive with zero
alias dd-sda-r='sudo dd if=/dev/urandom of=/dev/sda bs=102400'	# to wipe hard drive with random data option (1)
alias dd-sdb-r='sudo dd if=/dev/urandom of=/dev/sdb bs=102400'	# to wipe hard drive with random data option (1)
alias dd-sdc-r='sudo dd if=/dev/urandom of=/dev/sdc bs=102400'	# to wipe hard drive with random data option (1)
alias dd-sdd-r='sudo dd if=/dev/urandom of=/dev/sdd bs=102400'	# to wipe hard drive with random data option (1)
alias dd-sde-r='sudo dd if=/dev/urandom of=/dev/sde bs=102400'	# to wipe hard drive with random data option (1)
alias dd-sdf-r='sudo dd if=/dev/urandom of=/dev/sdf bs=102400'	# to wipe hard drive with random data option (1)
alias dd-sdg-r='sudo dd if=/dev/urandom of=/dev/sdg bs=102400'	# to wipe hard drive with random data option (1)
alias dd-sda-full='sudo dd if=/dev/urandom of=/dev/sda bs=8b conv=notrunc,noerror'	# to wipe hard drive with random data option (2)
alias dd-sdb-full='sudo dd if=/dev/urandom of=/dev/sdb bs=8b conv=notrunc,noerror'	# to wipe hard drive with random data option (2)
alias dd-sdc-full='sudo dd if=/dev/urandom of=/dev/sdc bs=8b conv=notrunc,noerror'	# to wipe hard drive with random data option (2)
alias dd-sdd-full='sudo dd if=/dev/urandom of=/dev/sdd bs=8b conv=notrunc,noerror'	# to wipe hard drive with random data option (2)
alias dd-sde-full='sudo dd if=/dev/urandom of=/dev/sde bs=8b conv=notrunc,noerror'	# to wipe hard drive with random data option (2)
alias dd-sdf-full='sudo dd if=/dev/urandom of=/dev/sdf bs=8b conv=notrunc,noerror'	# to wipe hard drive with random data option (2)
alias dd-sdg-full='sudo dd if=/dev/urandom of=/dev/sdg bs=8b conv=notrunc,noerror'	# to wipe hard drive with random data option (2)


##############REPOSITORIO DE ALIAS###################
alias dmesg+='watch "dmesg |tail -20"'

	#alias cp=’cp -rfv‘
	#alias mv=’mv -v‘
	#alias rm=’rm -rf‘
	#alias cd..=’cd ..‘
	#alias ..=’cd ..‘
	#alias install=’sudo apt-get install‘
	#alias update=’sudo apt-get update‘
	#alias upgrade=’sudo apt-get upgrade‘
	#alias remove=’sudo apt-get remove‘
	#alias purge=’sudo apt-get purge‘
	#alias autoremove=’sudo apt-get autoremove‘
	#alias aptsearch=’aptitude search‘
	#alias fdisk=’sudo fdisk -l‘
	#alias smbstatus=’sudo smbstatus‘
	#alias rcconf=’sudo rcconf‘
	#alias apache=’sudo /etc/init.d/apache2‘
	#alias e=’exit‘
	#alias isomount=’sudo mount -t iso9660 -o loop‘
	#alias freespace=’df -h‘
	#alias bluetooth=’sudo /etc/init.d/bluetooth‘
	#alias samba=’sudo /etc/init.d/samba‘
	#alias nmapscan=’sudo nmap -O -sS -PN‘
	#alias nmapscan2=’sudo nmap -vAPN‘
	#alias wbaredit=’sudo nano /usr/bin/star_wbar‘
	#alias wbarexecute=’/usr/bin/./star_wbar &‘
	#alias conkyedit=’sudo nano /usr/local/bin/star_conky‘
	#alias isoumount=’sudo umount /media/‎temp‘
	#alias sources.list=’sudo nano /etc/apt/sources.list‘
	#alias bashrc=’nano /home/kzkggaara/.bashrc‘
	#alias sshclean=’rm /home/kzkggaara/.ssh/known_hosts‘





fi	# end interactive check﻿

alias cp='gcp'



export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
