import React from 'react';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {View, TouchableOpacity, TouchableHighlight} from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';

const {
  Clock,
  Value,
  set,
  cond,
  startClock,
  clockRunning,
  timing,
  block,
  interpolate,
  concat,
  debug,
  stopClock,
  color,
  eq,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),

    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: dest,
    easing: Easing.linear,
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    debug('position', state.position),

    state.position,
  ]);
}
/*props - {
  onColor - in rgb
  offColor -in rgb
  isOn
  onToggle

}*/

export const ToggleSwitch = () => {
  const [on, setOn] = useState(false);
  let range1 = new Animated.Value(0);
  let range2 = new Animated.Value(0);
  let transX = new Animated.Value(0);
  let backgrndClrOn = new Animated.Value(0);
  let backgrndClrOff = new Animated.Value(0);

  transX = runTiming(new Clock(), new Value(0), new Value(1));
  range1 = interpolate(transX, {
    inputRange: [0, 1],
    outputRange: [0, 40],
    extrapolate: Animated.Extrapolate.CLAMP,
  });
  range2 = interpolate(transX, {
    inputRange: [0, 1],
    outputRange: [40, 0],
    extrapolate: Animated.Extrapolate.CLAMP,
  });

  // backgrndClrOn = color(
  //   0,
  //   156,
  //   0,
  //   interpolate(transX, {
  //     inputRange: [0, 1],
  //     outputRange: [0, 1],
  //   }),
  // );
  // backgrndClrOff = color(
  //   192,
  //   192,
  //   192,
  //   interpolate(transX, {
  //     inputRange: [0, 1],
  //     outputRange: [0, 1],
  //   }),
  // );

  return (
    <TouchableOpacity
      onPress={() => {
        setOn(!on);
      }}>
      <Animated.View
        style={{
          width: 80,
          height: 39,

          borderRadius: 20,

          padding: 2,
          backgroundColor: on ? 'rgb(0,156,0)' : 'rgb(192,192,192)',
        }}>
        <Animated.View
          style={{
            width: 35,
            height: 35,
            borderRadius: 20,
            backgroundColor: 'white',
            padding: 5,

            transform: [{translateX: on ? range1 : range2}],
          }}></Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
};
ToggleSwitch.PropTypes = {
  onColor: PropTypes.string,
  offColor: PropTypes.string,
  isOn: PropTypes.bool,
  onToggle: PropTypes.func,
};
