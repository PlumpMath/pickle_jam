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
      if (pad){
        Session.set("selected_text", pad.text);
      }
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
      debugger;
      Session.set("selected_text", event.target.value);
      var padid = Session.get("selected_pad");
      Pads.update(padid, {$set: {text:  event.target.value}});
      Meteor.flush();
      SetCaretAtEnd($("#pad-text")[0]);
    }
  });



}

if (Meteor.isServer) {
  Meteor.startup(function () {
    var pads = Pads.find();
    pads.forEach(function (pad) {
      Pads.remove(pad._id);
    });
    Pads.insert({name: "Cookie", text: "Given: I want a cookie."})
    Pads.insert({name: "Pie", text: "Given: I want some pie."})
  });
}


function SetCaretAtEnd(elem) {
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
