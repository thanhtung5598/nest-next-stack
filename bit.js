const DAI_1 = [
  '51',
  '479',
  '6881',
  '8969',
  '6132',
  '3934',
  '16256',
  '78378',
  '71734',
  '38235',
  '43444',
  '77958',
  '89472',
  '89579',
  '04358',
  '51279',
  '31261',
  '066832',
];

const DAI_2 = [
  '19',
  '451',
  '9963',
  '4885',
  '3010',
  '2471',
  '92255',
  '43671',
  '07019',
  '72688',
  '78243',
  '68636',
  '68503',
  '77361',
  '70112',
  '20821',
  '24097',
  '533584',
];

const DAIS = [DAI_1, DAI_2];

// Mien Nam
// Bao lo
const mergeBaoLoCheck =
  '79b2n2dai, 203b3n2dai, 3330b2n2dai, 330b1n2dai, 30b2n2dai, 25b5n2dai, 3333b3n2dai, 35dd3n2dai, 38dd8n2dai, 40dd2n2dai, 355xc25n2dai, 350xc20n2dai, 23b1nxc10ndd10n2dai, 232xc10ndd10n2dai, [24.41]da2n2dai';

const splitMergedBaoLo = mergeBaoLoCheck.split(',').map((de) => de.trim());

const getNumberOfDais = (checkString) => {
  const match = checkString.match(/(\d+)dai.*/);
  if (match) {
    return parseInt(match[1]);
  }
  return 1;
};

const getCostPerN = (bet) => {
  const match = bet.match(/(\d+)(b(\d+))n/);
  const numberOfDais = getNumberOfDais(bet);

  if (match) {
    const prefix = match[1];

    const length = prefix.length;
    switch (length) {
      case 2:
        return 18000 * numberOfDais;
      case 3:
        return 17000 * numberOfDais;
      case 4:
        return 16000 * numberOfDais;
      default:
        return 0;
    }
  }
  return 0;
};

const parseCombinedBet = (combinedBet) => {
  const mainNumberMatch = combinedBet.match(/^(\d+)/); // Capture the main number prefix
  const mainNumber = mainNumberMatch ? mainNumberMatch[1] : null;

  const pattern = /b(\d+)n|xc(\d+)n|dd(\d+)n/g;
  const matches = [];
  let match;

  while ((match = pattern.exec(combinedBet)) !== null) {
    const numberOdDais = getNumberOfDais(combinedBet);

    if (match[1]) matches.push(`${mainNumber}b${match[1]}n${numberOdDais}dai`);
    if (match[2]) matches.push(`${mainNumber}xc${match[2]}n${numberOdDais}dai`);
    if (match[3]) matches.push(`${mainNumber}dd${match[3]}n${numberOdDais}dai`);
  }

  const pattern2 = /\[(\d+([.]\d+)*)\]da(\d+)n/g;
  let match2;

  while ((match2 = pattern2.exec(combinedBet)) !== null) {
    const numberOdDais = getNumberOfDais(combinedBet);
    matches.push(`[${match2[1]}]da${match2[3]}n${numberOdDais}dai`);
  }

  return matches;
};

const calculateTotalStake = (baoLotList) => {
  let totalStake = 0;

  baoLotList.forEach((bet) => {
    const parsedBets = parseCombinedBet(bet);

    parsedBets.forEach((betParse) => {
      const matchB = betParse.match(/(\d+)(b(\d+))n/); // Match for 'b' followed by 'n'
      const matchXC = betParse.match(/(\d+)(xc(\d+))n/); // Match for 'xc' followed by 'n'
      const matchDD = betParse.match(/(\d+)(dd(\d+))n/); // Match for 'dd' followed by 'n'
      const matchDA = betParse.match(/\[(\d+([.]\d+)*)\]da(\d+)n/); // Match for 'da' followed by 'n'

      if (matchB) {
        const amount = parseInt(matchB[3]);
        const costPerN = getCostPerN(betParse);
        totalStake += amount * costPerN;
      }

      if (matchXC) {
        const suffixXC = parseInt(matchXC[3]);
        const numberOdDais = getNumberOfDais(betParse);

        totalStake += suffixXC * 2000 * numberOdDais;
      }

      if (matchDD) {
        const suffixDD = parseInt(matchDD[3]);
        const numberOdDais = getNumberOfDais(betParse);

        totalStake += suffixDD * 2000 * numberOdDais;
      }

      if (matchDA) {
        const suffixDA = parseInt(matchDA[3]);
        const numberOdDais = getNumberOfDais(betParse);

        totalStake += suffixDA * 36000 * numberOdDais;
      }
    });
  });

  return totalStake;
};

const totalAmountToPayFor = calculateTotalStake(splitMergedBaoLo);

console.log('totalAmountToPayFor', totalAmountToPayFor);
