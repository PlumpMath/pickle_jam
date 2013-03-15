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
      Session.set("selected_text", event.target.value);
      var padid = Session.get("selected_pad");
      Pads.update(padid, {$set: {text:  event.target.value}});
      Meteor.flush();
    }
  });

  Template.pad_edit.preserve({
    'textarea': function (node) { return node.id; }
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


