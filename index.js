var util = require('util')

exports.interactiveScript = ';('+interactive.toString()+')();'

var cmd

exports.configureApp = function(config) {
  var app = config.app
  cmd = config.cmd

  if (app) {
    app.use(function(req, res, next) {
      app.locals.debugLines = true
      app.locals.interactiveScript = exports.interactiveScript
      next()
    })

    app.get('/open', function(req, res, next) {
      var file = req.query.file
      var line = req.query.line
      exports.openFile(file, line, function(err) {
        if (err) console.log('err', err)
      })
      res.end()
    })
  }
}

exports.openFile = function(file, line, callback) {
  var fullcmd = util.format(cmd, file, line)
  require('child_process').exec(fullcmd, function(err, stdout, stderr) {
    if (err) return callback(err)
    callback()
  })
}

function interactive() {

  var touchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch

  function loadScript(url, callback) {
    var head = document.getElementsByTagName('head')[0]
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.onreadystatechange = function (){
      if (this.readyState == 'complete') callback()
    }
    script.onload = callback
    script.src = url
    head.appendChild(script)
  }

  function init() {
    var dbg = document.getElementById('dbg')
    var overlay = null
    if (!dbg) {
      dbg = document.createElement('div')
      dbg.setAttribute('style', 'display:none; position:fixed; background-color:red; color:white; padding:10px; top:0; right:0; z-index: 9999999; font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif')
      dbg.appendChild(document.createTextNode('DEBUG'))
      document.body.appendChild(dbg)
      overlay = document.createElement('div')
      overlay.setAttribute('style', 'position:absolute; background:black; opacity:0.5; transition: 0.2s; pointer-events:none')
      document.body.appendChild(overlay)
      var enabled = false

      function toggleDebugMode() {
        enabled = !enabled
        dbg.style.display = enabled ? 'block': 'none'
        overlay.style.display = enabled ? 'block': 'none'
        console.log('debug mode enabled', enabled)
        if (!enabled) {
          overlay.style.width = '0'
          overlay.style.height = '0'
          focusedNode = null
        }
      }

      var focusedNode = null

      function focusNode(e) {
        if (!enabled) return;
        overlay.style.display = 'block'

        function getPosition(element) {
            var xPosition = 0;
            var yPosition = 0;
          
            while (element) {
              xPosition += (element.offsetLeft /*- element.scrollLeft*/ + element.clientLeft);
              yPosition += (element.offsetTop /*- element.scrollTop*/ + element.clientTop);
              element = element.offsetParent;
            }
            return { x: xPosition, y: yPosition };
        }
        var position = getPosition(e.target)
        overlay.style.left = position.x+'px'
        overlay.style.top = position.y+'px'
        overlay.style.width = e.target.offsetWidth+'px'
        overlay.style.height = e.target.offsetHeight+'px'
        focusedNode = e.target
      }

      function openFile(e) {
        if (!enabled) return
        e.preventDefault()
        e.stopPropagation && e.stopPropagation()
        var node = e.target
        var file, line;
        do {
          file = file || node.getAttribute('jade_file')
          line = line || node.getAttribute('jade_line')
          node = node.parentNode
        } while((!file || !line) && node)

        if (file && line) {
          var req = new XMLHttpRequest();
          req.open('get', '/open?file='+encodeURIComponent(file)+'&line='+encodeURIComponent(line), false);
          req.send();
        }
      }

      if (touchDevice) {
        console.log('press to enable/disable the debug mode')
        new Hammer(document.body).on('press', toggleDebugMode)
        new Hammer(document.body).on('tap', function(e) {
          e.target === focusedNode ? openFile(e) : focusNode(e)
        })
      } else {
        console.log('press shift+cmd+m to enable/disable the debug mode')
        Mousetrap.bind('mod+shift+m', toggleDebugMode)

        document.addEventListener('click', openFile, true)
        document.addEventListener('mousemove', focusNode, true)
      }

    }
  }

  var helper = touchDevice ?
    'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.4/hammer.min.js' :
    'https://cdnjs.cloudflare.com/ajax/libs/mousetrap/1.4.6/mousetrap.js'
  loadScript(helper, init)

}

