#!/bin/sh
# manage.sh: manage vimeo static page
# CAPSUL inc

# change video ID
_changeVideo=$(cat <<EOF
db.videos.updateOne({ campaign: 'default' }, {
  \$set: {
    id: '$2'
  }
}, { upsert: true, new: true } )
EOF
)

# clear user collection
_clearUsers=$(cat <<EOF
db.users.drop()
EOF
)

[ -z "$MONGODB_URI" ] && echo "You must specify the mongo URI" && exit
[ -z "$1" ] && echo "Usage: $0 cmd [opts]" && exit
[ -z "$2" ] && [ "$1" = "changeVideo" ] && echo "Usage: $0 $1 videoId" && exit

# binario do mongo existe?
which mongo >& /dev/null && [ $? -eq 0 ] || { 
  echo "There seems to be a problem with mongo binary"
  exit 1
}

echo "`eval "echo \\\$_$1"`" | mongo "$MONGODB_URI"
echo ""

[ $? -eq 0 ] \
&& echo "Records updated" \
|| echo "There was an error"
