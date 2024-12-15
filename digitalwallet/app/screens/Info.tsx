import { View, Text } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';

const Info = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Ky aplikacion është zhvilluar si pjesë e temës sime të diplomës 📕 në 
                fushën e Inxhinierise Kompjuterike dhe Softuerike 💻. 
                Qëllimi kryesor i tij është të ofrojë një mënyrë të thjeshtë dhe 
                të sigurt për të kryer pagesa 💰 dhe për të menaxhuar transaksionet 
                financiare përmes QR code 剔. Ky projekt përfaqëson një zgjidhje të krijuar 
                për të adresuar nevojat e pagesave digjitale dhe siguron fleksibilitet për 
                përdoruesit në kryerjen e transaksioneve pa para fizike 💵.</Text>
            <Text style={styles.textTitle}>Qellimi:</Text>
            <Text style={styles.text}>💲 Ky aplikacion është krijuar për të thjeshtuar pagesat dixhitale 
                përmes teknologjisë së kodeve QR, duke i bërë transaksionet të shpejta, 
                të sigurta dhe efikase 💸.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      marginHorizontal: 5
    },
    textTitle: {
        fontSize: 20,
        marginTop: 20,
        marginBottom: 5,
        fontWeight: 800
    },
    text: {
      fontSize: 18,
      marginVertical: 5,
      fontWeight: '500',
    },
  });

export default Info;