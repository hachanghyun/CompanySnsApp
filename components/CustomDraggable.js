import React from 'react';
import Draggable from 'react-native-draggable';

const CustomDraggable = ({
  children,
  x = 0,
  y = 0,
  // 필요한 다른 기본 매개변수를 여기에서 설정하세요.
  ...props
}) => {
  return <Draggable x={x} y={y} {...props}>{children}</Draggable>;
};

export default CustomDraggable;
