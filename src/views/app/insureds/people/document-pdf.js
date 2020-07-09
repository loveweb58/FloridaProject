import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font 
} from "@react-pdf/renderer";
import moment from "moment";
import font from "./pdf-font/Nunito-Regular.ttf"

const BORDER_COLOR = '#bfbfbf'
const BORDER_STYLE = 'solid'

// Register font
Font.register({ family: 'Nunito', src: font });

const styles = StyleSheet.create({
  body: {
    padding: 30,
    fontFamily: 'Nunito',
  },
  headng: {
    marginTop:20,
    width: "auto",
    textAlign: "center"
  },
  caseTag: {
    marginTop:20,
    width: "auto",
    textAlign: "left",
    fontSize: 12,
  },
  table: { 
    display: "table", 
    width: "auto",
    borderStyle: BORDER_STYLE, 
    borderColor: '#8f8f8f',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    marginTop:10
  }, 
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol1Header: { 
    width: 50 + '%', 
    borderStyle: BORDER_STYLE, 
    borderColor: '#8f8f8f',
    borderWidth: 1,
    borderTopWidth: 0
  },     
  tableColHeader: { 
    width: 50 + "%", 
    borderStyle: BORDER_STYLE,
    borderColor: '#8f8f8f',
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0
  },   
  tableCol1: { 
    width: 50 + '%', 
    borderStyle: BORDER_STYLE, 
    borderColor: '#8f8f8f',
    borderWidth: 1,
    borderTopWidth: 0
  },   
  tableCol: { 
    width: 50 + "%", 
    borderStyle: BORDER_STYLE,
    borderColor: '#8f8f8f',
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0
  }, 
  tableCellHeader: {
    marginVertical: 5,
    marginHorizontal: 10,
    fontSize: 12,
    fontWeight: 700
  },  
  tableCell: { 
    marginVertical: 3,
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: 300
  }
});

export function PdfDocument(props) {
    console.log("pdf props", props.data);
    return (
      <Document>
        <Page style={styles.body}>
          <View style={styles.headng}>
            <Text>{props.personName && props.personName}'s Combined Case</Text>
          </View>
          {
            props.data_collections && props.data_collections.map((caseItem, i) => {
              if(caseItem.isSelect) {
                let breakCondition = false;
                return (
                  <>
                  {
                  caseItem.metaFields && caseItem.metaFields.map((metaItem, j) => {
                    if(metaItem.isChecked && props.data.includes(metaItem.name) && !breakCondition) {
                      return (
                        (!breakCondition) ?
                        <>
                        {
                          breakCondition  = true
                        }
                        <View style={styles.caseTag} key={i}>
                          <Text>Case Name: {caseItem.name}</Text>
                        </View>
                        <View style={styles.table}>
                          <View style={styles.tableRow}>
                            <View style={styles.tableCol1Header}> 
                                <Text style={styles.tableCellHeader}>Name</Text> 
                            </View> 
                            <View style={styles.tableColHeader}> 
                                <Text style={styles.tableCellHeader}>Value</Text> 
                            </View> 
                          </View>
                          {
                            caseItem.metaFields ?
                                caseItem.metaFields.map((v, i) => {
                                if(v.isChecked && props.data.includes(v.name)){
                                  if(v.type == "str"){
                                    return (
                                      <View style={styles.tableRow} key={i}>
                                        <View style={styles.tableCol1}> 
                                          <Text style={styles.tableCell}>{v.name}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                          <Text style={styles.tableCell}>{v.value}</Text> 
                                        </View>
                                      </View>
                                    )
                                  }

                                  if(v.type == "bool"){
                                    return (
                                      <View style={styles.tableRow} key={i}>
                                        <View style={styles.tableCol1}> 
                                          <Text style={styles.tableCell}>{v.name}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                          <Text style={styles.tableCell}>{v.value ? 'True' : 'False'}</Text> 
                                        </View>
                                      </View>
                                    )
                                  }

                                  if(v.type == "box"){
                                    return (
                                      <View style={styles.tableRow} key={i}>
                                        <View style={styles.tableCol1}> 
                                          <Text style={styles.tableCell}>{v.name}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                          <Text style={styles.tableCell}>
                                            {
                                              (v.name == 'Gender') ?
                                                v.value ? v.value['label'] : '-'
                                              :
                                                v.value ? v.value['label']+' - '+v.value['value'] : '-'
                                            }
                                          </Text> 
                                        </View>
                                      </View>
                                    )
                                  }

                                  if(v.type == "date"){
                                    return (
                                      <View style={styles.tableRow} key={i}>
                                        <View style={styles.tableCol1}> 
                                          <Text style={styles.tableCell}>{v.name}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                          <Text style={styles.tableCell}>
                                            {
                                              v.value ? moment(v.value).format('DD-MM-YYYY') : '-'
                                            }
                                          </Text> 
                                        </View>
                                      </View>
                                    )
                                  }

                                  if(v.type == "date_range"){
                                    return (
                                      <View style={styles.tableRow} key={i}>
                                        <View style={styles.tableCol1}> 
                                          <Text style={styles.tableCell}>{v.name}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                          <Text style={styles.tableCell}>
                                            {
                                              v.value ? moment(v.value[0]).format('DD-MM-YYYY') + ' ~ ' +  moment(v.value[1]).format('DD-MM-YYYY'): '-'
                                            }
                                          </Text> 
                                        </View>
                                      </View>
                                    )
                                  }

                                  if(v.type == "int_range"){
                                    return (
                                      <View style={styles.tableRow} key={i}>
                                        <View style={styles.tableCol1}> 
                                          <Text style={styles.tableCell}>{v.name}</Text> 
                                        </View>
                                        <View style={styles.tableCol}> 
                                          <Text style={styles.tableCell}>
                                            {
                                              v.value ? v.value[0] + ' ~ ' +  v.value[1] : '-'
                                            }
                                          </Text> 
                                        </View>
                                      </View>
                                    )
                                  }
                                  }
                                })
                            :
                            null
                          }
                        </View>
                        
                        </>
                        :
                        null
                      )
                      
                    }
                    
                  })
                  }
                  </>
                )
              }
            })
          }
          
                
            </Page>
        </Document>
    );
}