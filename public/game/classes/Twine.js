module.exports = (function () {
  'use strict';

  var Twine = function(string, style){
    if(typeof string === 'string'){
      this.original = string;
      this.string = string + '';
      this.working = string + '';
    }else{
      this.original = null;
      this.string = '';
      this.working = '';
    }
    if(typeof style === 'object'){
      for(var funcName in style){
        if( style.hasOwnProperty(funcName) && typeof this[funcName] === 'function' && funcName !== 'commit' && funcName !== 'reset' && funcName !== 'toString' ){
          if(!(style[funcName] instanceof Array)) style[funcName] = [style[funcName]];
          this[funcName].apply(this, style[funcName]);
        }
      }
      this.commit();
    }
  };

  var constructSpanFromStyle = function(property, value, contents){
    return '<span style="' + property + ':' + value + ';">' + contents + '</span>';
  };
  var constructSpanFromAttr = function(attr, value, contents){
    return '<span ' + attr + '="' + value + '">' + contents + '</span>';
  };

  Twine.prototype.class = function(classes){
    if(classes instanceof Array) classes = classes.join(' ');
    this.working = constructSpanFromAttr('class', classes, this.working);
  };

  Twine.prototype.family = function(family){
    this.working = constructSpanFromStyle('font-family', family, this.working);
  };

  Twine.prototype.size = function(size){
    if(typeof size === 'number') size = '' + size + 'px';
    this.working = constructSpanFromStyle('font-size', size, this.working);
  };

  Twine.prototype.color = function(color){
    this.working = constructSpanFromStyle('color', color, this.working);
  };

  Twine.prototype.backgroundColor = function(color){
    this.working = constructSpanFromStyle('padding', '10px', this.working);
    this.working = constructSpanFromStyle('background-color', color, this.working);
  };

  Twine.prototype.highlight = Twine.prototype.backgroundColor;

  Twine.prototype.weight = function(weight){
    this.working = constructSpanFromStyle('font-weight', weight, this.working);
  };

  Twine.prototype.style = function(style){
    this.working = constructSpanFromStyle('font-style', style, this.working);
  };

  Twine.prototype.commit = function(){
    this.string = this.working + '';
    return this.string;
  };

  Twine.prototype.reset = function(toOriginal){
    if(!toOriginal){
      this.working = this.string + '';
      return this.working;
    }else{
      this.string = this.original + '';
      return this.reset(false);
    }
  };

  Twine.prototype.toString = function(){
    return this.string;
  };

  return Twine;

})();