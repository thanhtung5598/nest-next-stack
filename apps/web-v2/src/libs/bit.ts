type DaiInfo = {
  numberOfDai: number;
  daiPosition: string;
};

const getNumberOfDais = (checkString: string): DaiInfo => {
  const match = checkString.match(/(\d+)dai(.*)/);

  if (match) {
    return {
      numberOfDai: parseInt(match[1] || ''),
      daiPosition: match[2] || '',
    };
  }

  return {
    numberOfDai: 1,
    daiPosition: '',
  };
};

const getCostPerN = (bet: string) => {
  const match = bet.match(/(\d+)(b(\d+))n/);
  const { numberOfDai } = getNumberOfDais(bet);

  if (match) {
    const prefix = match[1];

    const length = prefix?.length;
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

const parseCombinedBet = (combinedBet: string) => {
  const mainNumberMatch = combinedBet.match(/^(\d+)/); // Capture the main number prefix
  const mainNumber = mainNumberMatch ? mainNumberMatch[1] : null;

  const pattern = /b(\d+)n|xc(\d+)n|dd(\d+)n|dau(\d+)n|duoi(\d+)n/g;
  const matches = [];
  let match;

  while ((match = pattern.exec(combinedBet)) !== null) {
    const { numberOfDai } = getNumberOfDais(combinedBet);

    if (match[1]) matches.push(`${mainNumber}b${match[1]}n${numberOfDai}dai`);
    if (match[2]) matches.push(`${mainNumber}xc${match[2]}n${numberOfDai}dai`);
    if (match[3]) matches.push(`${mainNumber}dd${match[3]}n${numberOfDai}dai`);
    if (match[4]) matches.push(`${mainNumber}dau${match[4]}n${numberOfDai}dai`);
    if (match[5]) matches.push(`${mainNumber}duoi${match[5]}n${numberOfDai}dai`);
  }

  const pattern2 = /\[(\d+([.]\d+)*)\]da(\d+)n/g;
  let match2;

  while ((match2 = pattern2.exec(combinedBet)) !== null) {
    const { numberOfDai } = getNumberOfDais(combinedBet);
    matches.push(`[${match2[1]}]da${match2[3]}n${numberOfDai}dai`);
  }

  return matches;
};

export const calculateTotalStake = (baoLotList: string[]) => {
  let totalStake = 0;

  baoLotList.forEach((bet) => {
    const parsedBets = parseCombinedBet(bet);

    parsedBets.forEach((betParse) => {
      const matchB = betParse.match(/(\d+)(b(\d+))n/); // Match for 'b' followed by 'n'
      const matchXC = betParse.match(/(\d+)(xc(\d+))n/); // Match for 'xc' followed by 'n'
      const matchDD = betParse.match(/(\d+)(dd(\d+))n/); // Match for 'dd' followed by 'n'
      const matchDA = betParse.match(/\[(\d+([.]\d+)*)\]da(\d+)n/); // Match for 'da' followed by 'n'
      const matchDau = betParse.match(/(\d+)(dau(\d+))n/); // Match for 'dau' followed by 'n'
      const matchDuoi = betParse.match(/(\d+)(duoi(\d+))n/); // Match for 'duoi' followed by 'n'

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

      if (matchDau) {
        const suffixDau = parseInt(matchDau[3] as any);
        const { numberOfDai } = getNumberOfDais(betParse);

        totalStake += suffixDau * 1000 * numberOfDai;
      }

      if (matchDuoi) {
        const suffixDuoi = parseInt(matchDuoi[3] as any);
        const { numberOfDai } = getNumberOfDais(betParse);

        totalStake += suffixDuoi * 1000 * numberOfDai;
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

  const pattern = /b(\d+)n|xc(\d+)n|dd(\d+)n|dau(\d+)n|duoi(\d+)n/g;
  const matches = [];
  let match;

  while ((match = pattern.exec(combinedBet)) !== null) {
    const { numberOfDai, daiPosition } = getNumberOfDais(combinedBet);

    if (match[1]) matches.push(`${mainNumber}b${match[1]}n${numberOfDai}dai${daiPosition}`);
    if (match[2]) matches.push(`${mainNumber}xc${match[2]}n${numberOfDai}dai${daiPosition}`);
    if (match[3]) matches.push(`${mainNumber}dd${match[3]}n${numberOfDai}dai${daiPosition}`);
    if (match[4]) matches.push(`${mainNumber}dau${match[4]}n${numberOfDai}dai${daiPosition}`);
    if (match[5]) matches.push(`${mainNumber}duoi${match[5]}n${numberOfDai}dai${daiPosition}`);
  }

  const pattern2 = /\[(\d+([.]\d+)*)\]da(\d+)n/g;
  let match2;

  while ((match2 = pattern2.exec(combinedBet)) !== null) {
    const { numberOfDai, daiPosition } = getNumberOfDais(combinedBet);
    matches.push(`[${match2[1]}]da${match2[3]}n${numberOfDai}dai${daiPosition}`);
  }

  return matches;
};

function findPairs(arr: number[], daNumber: [number, number]): { [key: number]: number }[] {
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

export const calculateTotalAmountReward = (baoLotList: string[], dais: any) => {
  const winRewards: any = [];

  baoLotList.forEach((bet) => {
    const parsedBets = parseCombinedBetReward(bet);

    parsedBets.forEach((betParse) => {
      const matchB = betParse.match(/(\d+)(b(\d+))n/); // Match for 'b' followed by 'n'
      const matchXC = betParse.match(/(\d+)(xc(\d+))n/); // Match for 'xc' followed by 'n'
      const matchDD = betParse.match(/(\d+)(dd(\d+))n/); // Match for 'dd' followed by 'n'
      const matchDA = betParse.match(/\[(\d+([.]\d+)*)\]da(\d+)n/); // Match for 'da' followed by 'n'
      const matchDau = betParse.match(/(\d+)(dau(\d+))n/); // Match for 'dau' followed by 'n'
      const matchDuoi = betParse.match(/(\d+)(duoi(\d+))n/); // Match for 'duoi' followed by 'n'

      if (matchB) {
        const { daiPosition } = getNumberOfDais(betParse);
        const bNumber = matchB[1] as string;
        const amount = parseInt(matchB[3] as string);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = dais[daiIndex].filter((lo: string) => {
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

        const xcNumber = matchXC[1] as string;
        const amount = parseInt(matchXC[3] as string);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = dais[daiIndex].filter((lo: string, loIdx: number) => {
            if (loIdx === 1 || loIdx === dais[daiIndex].length - 1) {
              if (lo.slice(-xcNumber?.length) === xcNumber) {
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

        const ddNumber = matchDD[1] as string;
        const amount = parseInt(matchDD[3] as string);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = dais[daiIndex].filter((lo: string, loIdx: number) => {
            if (loIdx === 0 || loIdx === dais[daiIndex].length - 1) {
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

      if (matchDau) {
        const { daiPosition } = getNumberOfDais(betParse);

        const dauNumber = matchDau[1] as string;
        const amount = parseInt(matchDau[3] as string);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;

          const winLo = dais[daiIndex].filter((lo: string, loIdx: number) => {
            if (loIdx === 0) {
              if (lo.slice(-dauNumber.length) === dauNumber) {
                return lo;
              }
            }
          });

          if (winLo.length) {
            reward = winLo.length * amount * 75000;

            winRewards.push({
              daiIndex,
              winLo,
              lo: dauNumber,
              type: 'Dau',
              amount,
              reward,
            });
          }
        });
      }

      if (matchDuoi) {
        const { daiPosition } = getNumberOfDais(betParse);

        const duoiNumber = matchDuoi[1] as string;
        const amount = parseInt(matchDuoi[3] as string);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;

          const winLo = dais[daiIndex].filter((lo: string, loIdx: number) => {
            if (loIdx === 0) {
              if (lo.slice(-duoiNumber.length) === duoiNumber) {
                return lo;
              }
            }
          });

          if (winLo.length) {
            reward = winLo.length * amount * 75000;

            winRewards.push({
              daiIndex,
              winLo,
              lo: duoiNumber,
              type: 'Duoi',
              amount,
              reward,
            });
          }
        });
      }

      if (matchDA) {
        const { daiPosition } = getNumberOfDais(betParse);

        const daNumber = matchDA[1]?.split('.') as [string, string];
        const amount = parseInt(matchDA[3] as string);

        const daiPositionList = daiPosition.split('').map((dai) => parseInt(dai, 10) - 1);

        daiPositionList.forEach((daiIndex) => {
          let reward = 0;
          const winLo = dais[daiIndex].filter((lo: string) => {
            return lo.slice(-2) === daNumber[0] || lo.slice(-2) === daNumber[1];
          });

          if (winLo.length) {
            const mapWinLo = winLo.map((item: string) => item.slice(-2));
            const pairsOfWinLo = findPairs(mapWinLo, daNumber as any);

            if (pairsOfWinLo.length) {
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
          }
        });
      }
    });
  });

  return winRewards;
};
