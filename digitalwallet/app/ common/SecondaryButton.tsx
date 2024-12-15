import { Pressable, Text, StyleSheet } from 'react-native';

const SecondaryButton = ({ title, onPress }: { title: string; onPress: () => void }) => {
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button, 
        { backgroundColor: pressed ? '#878787' : '#eb2525' }
      ]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SecondaryButton;
