const unkown_names = ['A','B','C','D','E','F','G','H','I','J','S','K','T','Z'];

const positive_response = ['yes','yeah','allright','whynot','si','okay','ok','yep','yup','forsure','absolutely','idloveto','sure'];
const negative_response = ['no','noplease','nah','never','nothappening'];




// Hey bro what is the sum of 5 and 9 huh ??? 

String.prototype.format = function (argumentsz) {
  var i = 0, args = argumentsz;
  return this.replace(/{}/g, function () {
    return typeof args[i] != 'undefined' ? args[i++] : '';
  });
};

/* Speech Recognition */
const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

/* Speech Synthesis*/
const synth = window.speechSynthesis;
const speech_voice_name = synth.getVoices()[10];
const speech_rate = 1.0
const specch_pitch = 1.0


