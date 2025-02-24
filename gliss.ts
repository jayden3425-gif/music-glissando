enum GlizzType {
   Up,
   Down 
}
let midi_not = 0
let hz = 0
function midi_to_hz(midi: number) {
    midi_not = midi
    if (midi_not > 108) {
        music.rest(music.beat(BeatFraction.Half))
    } else if (midi_not < 21) {
        music.rest(music.beat(BeatFraction.Half))
    } else if (midi_not == 69) {
        hz = 440
    } else {
        hz = 440 * 2 ** ((midi_not - 69) / 12)
    }
    return hz
}
function glizz(midi_note: number, to: number, mode: GlizzType, ms: number) {
    const num = midi_note - to
    if (mode == GlizzType.Up) {
        const niu = num
        for (let index = 0; index <= niu; index++) {
            music.play(music.tonePlayable(midi_to_hz(midi_note + 1 * index), ms / niu), music.PlaybackMode.UntilDone)
        }
    } else if (mode == GlizzType.Down) {
        const niu = num
        for (let index = 0; index <= niu; index++) {
            music.play(music.tonePlayable(midi_to_hz(midi_note - 1 * index), ms / niu), music.PlaybackMode.UntilDone)
        }
    } else {
        return
    }
}
namespace music {
    export class GlizzPlayable extends Playable {
        constructor(public midi_note: number, public num: number, public mode: GlizzType,public ms: number) {
            super()
        }
        
        play(playbackMode: PlaybackMode) {
            if (playbackMode = PlaybackMode.UntilDone) {
                glizz(this.midi_note, this.num, this.mode, this.ms)
            } else if (playbackMode = PlaybackMode.InBackground) {
                control.runInParallel(() => glizz(this.midi_note, this.num, this.mode, this.ms))
            } else if (playbackMode = PlaybackMode.LoopingInBackground) {
                this.loop()
            }
        }
    }
    
    //% group="Glizz"
    //% block="glizz $midi_note to $to for $ms $mode"
    //% toolboxParent=music_playable_play
    //% toolboxParentArgument=toPlay
    //% parts="headphone"
    //% duplicateShadowOnDrag
    //% ms.shadow=device_beat
    //% inlineInputMode=inline
    export function glizzPlayable(midi_note: number, to: number, mode: GlizzType, ms: number): Playable {
        return new GlizzPlayable(midi_note, to, mode, ms)
    }
}