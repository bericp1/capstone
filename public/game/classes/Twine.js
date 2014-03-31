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

  var constructSpan = function(property, value, contents){
    return '<span style="' + property + ':' + value + ';">' + contents + '</span>';
  };

  Twine.prototype.family = function(family){
    this.working = constructSpan('font-family', family, this.working);
  };

  Twine.prototype.size = function(size){
    if(typeof size === 'number') size = '' + size + 'px';
    this.working = constructSpan('font-size', size, this.working);
  };

  Twine.prototype.color = function(color){
    this.working = constructSpan('color', color, this.working);
  };

  Twine.prototype.backgroundColor = function(color){
    this.working = constructSpan('padding', '10px', this.working);
    this.working = constructSpan('background-color', color, this.working);
  };

  Twine.prototype.highlight = Twine.prototype.backgroundColor;

  Twine.prototype.weight = function(weight){
    this.working = constructSpan('font-weight', weight, this.working);
  };

  Twine.prototype.style = function(style){
    this.working = constructSpan('font-style', style, this.working);
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