Pads = new Meteor.Collection("pads");

if (Meteor.isClient) {
  Template.picklejam.pads = function () {
    return Pads.find({}, {sort: {name: 1}});
  };

  Template.picklejam.pad_chosen = function () {
    return Session.equals("selected_pad", this._id);
  };

  Template.pad.selected = function () {
    return Session.equals("selected_pad", this._id) ? "selected" : '';
  };

  Template.pad.events({
    'click': function () {
      Session.set("selected_pad", this._id);
      var pad = Pads.findOne(Session.get("selected_pad"));
    }
  });

  Template.pad_edit.text = function () {
    var pad =  Pads.findOne(Session.get("selected_pad"));
    if (pad && pad.text){
      return pad.text;
    }else{
      return "";
    }
  };

  Template.pad_edit.events({
    'keyup textarea' : function (event) {

      var elem = $("#pad-text")[0];
      var caretPos = doGetCaretPosition(elem);
      var padid = Session.get("selected_pad");
      Pads.update(padid, {$set: {text:  event.target.value}});
      Meteor.flush();
      setCaretPosition($("#pad-text")[0], caretPos);
    }
  });

;



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Pads.find().count() == 0){
      Pads.insert({name: "Cookie", text: "Given: I want a cookie."});
      Pads.insert({name: "Pie", text: "Given: I want some pie."});
    }else{
      var pads = Pads.find();
      pads.forEach(function (pad) {
        Pads.update(pad._id, {$set: {text: "Given: I want a cookie."}})
      });
    }
  });
}

function setCaretAtEnd(elem) {
        var elemLen = elem.value.length;
        // For IE Only
        if (document.selection) {
            // Set focus
            elem.focus();
            // Use IE Ranges
            var oSel = document.selection.createRange();
            // Reset position to 0 & then set at end
            oSel.moveStart('character', -elemLen);
            oSel.moveStart('character', elemLen);
            oSel.moveEnd('character', 0);
            oSel.select();
        }
        else if (elem.selectionStart || elem.selectionStart == '0') {
            // Firefox/Chrome
            elem.selectionStart = elemLen;
            elem.selectionEnd = elemLen;
            elem.focus();
        } // if
    } // SetCaretAtEnd()

function doGetCaretPosition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
}
function setCaretPosition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.setSelectionRange(pos,pos);
		ctrl.focus();
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

