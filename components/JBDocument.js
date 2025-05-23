import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { fontSize: 10, padding: 30, flexDirection: 'column', justifyContent: 'space-between' },
  section: { marginBottom: 10 },
  heading: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  box: { border: '1pt solid black', padding: 6, marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  footer: { textAlign: 'center', marginTop: 20, fontSize: 8 }
});

export function JBDDocument({ data }) {
  const now = new Date().toLocaleDateString();
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View>
          <View style={styles.section}>
            <Text style={styles.heading}>Rig Job By Design</Text>
            <View style={styles.row}>
              <Text>Operation: {String(data?.operation)}</Text>
              <Text>Rig: {String(data?.rig)}</Text>
              <Text>PIC: {String(data?.pic)}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Line of Fire - Major Hazards</Text>
            <View style={styles.box}>
              <Text>{String(data?.lofHazard)}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.heading}>Personnel Involved</Text>
            {(data?.workers ?? []).map((w, i) => (
              <Text key={i}>{i + 1}. {String(w)}</Text>
            ))}
          </View>
        </View>
        <View style={styles.footer}>
          <Text>PDF generated on {now}</Text>
        </View>
      </Page>
    </Document>
  );
}
