## Instalation

Include `jade-interactive` in your express application:

```
npm install jade-interactive --save
```

And in your main file (usually `app.js`):

```javascript
var interactive = require('jade-interactive')

app.set('view engine', 'jade')
// these lines configure jade-interactive in an express app
app.engine('jade', require('jade-debug').__express)
if (not_in_production) {
  interacive.configureApp({
    app: app,
    // Set the command to open your text editor
    // For SublimteText <executable> <file>:<line>
    cmd: '/Applications/Sublime\\ Text\\ 2.app/Contents/SharedSupport/bin/subl %s:%s',
  })
}
// --
```

Then in your main `jade` template (`layout.jade` for example)

```
script !{interactiveScript}
```

## Not using express?

Take a look to the `index.js` file and you will see that the module provides some functionality to integrate `jade-interactive` in any framework.

- You need to create a `/open` endpoint that receives a `file` and a `line` query parameter. Then call `interactive.openFile(file, line)`
- Include `interactive.interactiveScript` when rendering a `jade` template.
- Set `debugLines` to `true` in the options passed to the render function.

## Usage

- In a desktop browser use cmd/ctrl+shift+m to enable / disable the debug mode and then click on any DOM node to open the text editor
- In a touch device long press anywhere and the node will be highlighted. Tap on it again to open the text editor

## Help us :)

As you can see `jade-interactive` requires `jade-debug` which is a fork of jade. If you like `jade-interactive` please upvote this pull request https://github.com/jadejs/jade/pull/1879 and we no longer will need to use the fork :)
