/* eslint-disable */

export const DAI_1 = [
  '51',
  '232',
  '6822',
  '8969',
  '6132',
  '3934',
  '16256',
  '78378',
  '71734',
  '38235',
  '43444',
  '77958',
  '89481',
  '89579',
  '04343',
  '51279',
  '31281',
  '066479',
];

export const DAI_2 = [
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

export const DAI_3 = [
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

export const DAIS = [DAI_1, DAI_2, DAI_3];

// Mien Nam
// Bao lo
const mergeBaoLoCheck =
  '32b2n2dai12, 203b3n2dai, 3330b2n2dai, 330b1n2dai, 30b2n2dai, 25b5n2dai, 3333b3n2dai, 84dd3n2dai12, 38dd8n2dai, 40dd2n2dai, 479xc25n2dai12, 350xc20n2dai, 23b1nxc10ndd10n2dai, 232xc10ndd10n2dai12, [79.81]da2n1dai1';

const splitMergedBaoLo = mergeBaoLoCheck.split(',').map((de) => de.trim());

const getNumberOfDais = (checkString) => {
  const match = checkString.match(/(\d+)dai(.*)/);

  if (match) {
    return {
      numberOfDai: parseInt(match[1]),
      daiPosition: match[2],
    };
  }

  return {
    numberOfDai: 1,
    daiPosition: match[2],
  };
};

const getCostPerN = (bet) => {
  const match = bet.match(/(\d+)(b(\d+))n/);
  const { numberOfDai } = getNumberOfDais(bet);

  if (match) {
    const prefix = match[1];

    const length = prefix.length;
    switch (length) {
      case 2:
        return 18000 * numberOfDai;
      case 3:
        return 17000 * numberOfDai;
      case 4:
        return 16000 * numberOfDai;
      default:
        return 0;
    }
  }
  return 0;
};

const parseCombinedBet = (combinedBet: any) => {
  const mainNumberMatch = combinedBet.match(/^(\d+)/); // Capture the main number prefix
  const mainNumber = mainNumberMatch ? mainNumberMatch[1] : null;

  const pattern = /b(\d+)n|xc(\d+)n|dd(\d+)n/g;
  const matches = [];
  let match;

  while ((match = pattern.exec(combinedBet)) !== null) {
    const { numberOfDai } = getNumberOfDais(combinedBet);

    if (match[1]) matches.push(`${mainNumber}b${match[1]}n${numberOfDai}dai`);
    if (match[2]) matches.push(`${mainNumber}xc${match[2]}n${numberOfDai}dai`);
    if (match[3]) matches.push(`${mainNumber}dd${match[3]}n${numberOfDai}dai`);
  }

  const pattern2 = /\[(\d+([.]\d+)*)\]da(\d+)n/g;
  let match2;

  while ((match2 = pattern2.exec(combinedBet)) !== null) {
    const { numberOfDai } = getNumberOfDais(combinedBet);
    matches.push(`[${match2[1]}]da${match2[3]}n${numberOfDai}dai`);
  }

  return matches;
};

export const calculateTotalStake = (baoLotList: any) => {
  let totalStake = 0;

  baoLotList.forEach((bet: any) => {
    const parsedBets = parseCombinedBet(bet);

    parsedBets.forEach((betParse) => {
      const matchB = betParse.match(/(\d+)(b(\d+))n/); // Match for 'b' followed by 'n'
      const matchXC = betParse.match(/(\d+)(xc(\d+))n/); // Match for 'xc' followed by 'n'
      const matchDD = betParse.match(/(\d+)(dd(\d+))n/); // Match for 'dd' followed by 'n'
      const matchDA = betParse.match(/\[(\d+([.]\d+)*)\]da(\d+)n/); // Match for 'da' followed by 'n'

      if (matchB) {
        const amount = parseInt(matchB[3] as any);
        const costPerN = getCostPerN(betParse);
        totalStake += amount * costPerN;
      }

      if (matchXC) {
        const suffixXC = parseInt(matchXC[3] as any);
        const { numberOfDai } = getNumberOfDais(betParse);

        totalStake += suffixXC * 2000 * numberOfDai;
      }

      if (matchDD) {
        const suffixDD = parseInt(matchDD[3] as any);
        const { numberOfDai } = getNumberOfDais(betParse);

        totalStake += suffixDD * 2000 * numberOfDai;
      }

      if (matchDA) {
        const suffixDA = parseInt(matchDA[3] as any);
        const { numberOfDai } = getNumberOfDais(betParse);

        totalStake += suffixDA * 36000 * numberOfDai;
      }
    });
  });

  return totalStake;
};

const parseCombinedBetReward = (combinedBet: any) => {
  const mainNumberMatch = combinedBet.match(/^(\d+)/); // Capture the main number prefix
  const mainNumber = mainNumberMatch ? mainNumberMatch[1] : null;

  const pattern = /b(\d+)n|xc(\d+)n|dd(\d+)n/g;
  const matches = [];
  let match;

  while ((match = pattern.exec(combinedBet)) !== null) {
    const { numberOfDai, daiPosition } = getNumberOfDais(combinedBet);

    if (match[1]) matches.push(`${mainNumber}b${match[1]}n${numberOfDai}dai${daiPosition}`);
    if (match[2]) matches.push(`${mainNumber}xc${match[2]}n${numberOfDai}dai${daiPosition}`);
    if (match[3]) matches.push(`${mainNumber}dd${match[3]}n${numberOfDai}dai${daiPosition}`);
  }

  const pattern2 = /\[(\d+([.]\d+)*)\]da(\d+)n/g;
  let match2;

  while ((match2 = pattern2.exec(combinedBet)) !== null) {
    const { numberOfDai, daiPosition } = getNumberOfDais(combinedBet);
    matches.push(`[${match2[1]}]da${match2[3]}n${numberOfDai}dai${daiPosition}`);
  }

  return matches;
};

function findPairs(arr, daNumber) {
  const result = [];
  let i = 0;

  while (i < arr.length - 1) {
    const pairSet = new Set([arr[i], arr[i + 1]]);

    if (pairSet.has(daNumber[0]) && pairSet.has(daNumber[1])) {
      result.push({ [daNumber[0]]: daNumber[0], [daNumber[1]]: daNumber[1] });
      i += 2;
    } else {
      i += 1;
    }
  }

  return result;
}

export const calculateTotalAmountReward = (baoLotList) => {
  const winRewards = [];

  baoLotList.forEach((bet) => {
    const parsedBets = parseCombinedBetReward(bet);

    parsedBets.forEach((betParse) => {
      const matchB = betParse.match(/(\d+)(b(\d+))n/); // Match for 'b' followed by 'n'
      const matchXC = betParse.match(/(\d+)(xc(\d+))n/); // Match for 'xc' followed by 'n'
      const matchDD = betParse.match(/(\d+)(dd(\d+))n/); // Match for 'dd' followed by 'n'
      const matchDA = betParse.match(/\[(\d+([.]\d+)*)\]da(\d+)n/); // Match for 'da' followed by 'n'

      if (matchB) {
        const { daiPosition } = getNumberOfDais(betParse);
        const bNumber = matchB[1];
        const amount = parseInt(matchB[3]);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = DAIS[daiIndex].filter((lo) => {
            return lo.slice(-bNumber.length) === bNumber;
          });
          if (winLo.length) {
            if (bNumber?.length === 2) {
              reward = winLo.length * amount * 75000; // 75k
            }
            if (bNumber?.length === 3) {
              reward = winLo.length * amount * 650000; // 650k
            }
            if (bNumber?.length === 4) {
              reward = winLo.length * amount * 5500000; // 5tr5
            }

            winRewards.push({
              daiIndex,
              winLo,
              lo: bNumber,
              type: 'Bao',
              amount,
              reward,
            });
          }
        });
      }

      if (matchXC) {
        const { daiPosition } = getNumberOfDais(betParse);

        const xcNumber = matchXC[1];
        const amount = parseInt(matchXC[3]);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = DAIS[daiIndex].filter((lo, loIdx) => {
            if (loIdx === 1 || loIdx === DAIS[daiIndex].length - 1) {
              if (lo.slice(-xcNumber.length) === xcNumber) {
                return lo;
              }
            }
          });

          if (winLo.length) {
            reward = winLo.length * amount * 650000;

            winRewards.push({
              daiIndex,
              winLo,
              lo: xcNumber,
              type: 'XC',
              amount,
              reward,
            });
          }
        });
      }

      if (matchDD) {
        const { daiPosition } = getNumberOfDais(betParse);

        const ddNumber = matchDD[1];
        const amount = parseInt(matchDD[3]);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = DAIS[daiIndex].filter((lo, loIdx) => {
            if (loIdx === 0 || loIdx === DAIS[daiIndex].length - 1) {
              if (lo.slice(-ddNumber.length) === ddNumber) {
                return lo;
              }
            }
          });

          if (winLo.length) {
            reward = winLo.length * amount * 75000;

            winRewards.push({
              daiIndex,
              winLo,
              lo: ddNumber,
              type: 'DD',
              amount,
              reward,
            });
          }
        });
      }

      if (matchDA) {
        const { daiPosition } = getNumberOfDais(betParse);

        const daNumber = matchDA[1].split('.');
        const amount = parseInt(matchDA[3]);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = DAIS[daiIndex].filter((lo) => {
            return lo.slice(-2) === daNumber[0] || lo.slice(-2) === daNumber[1];
          });

          if (winLo.length) {
            const mapWinLo = winLo.map((item) => item.slice(-2));
            const pairsOfWinLo = findPairs(mapWinLo, daNumber);

            if (daiPositionList.length === 1) {
              reward = pairsOfWinLo.length * amount * 750000;
            }

            if (daiPositionList.length === 2) {
              reward = pairsOfWinLo.length * amount * 550000;
            }

            winRewards.push({
              daiIndex,
              pairsOfWinLo,
              lo: daNumber,
              type: 'DA',
              amount,
              reward,
            });
          }
        });
      }
    });
  });

  return winRewards;
};

const totalAmountToPayFor = calculateTotalStake(splitMergedBaoLo);
const totalAmountReward = calculateTotalAmountReward(splitMergedBaoLo);

console.log('totalAmountToPayFor', totalAmountToPayFor);
console.log('totalAmountReward', totalAmountReward);
