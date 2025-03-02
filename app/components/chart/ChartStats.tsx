import { BoxInfo } from '../BoxInfo';

export default function ChartStats() {
  return (
    <div className='flex justify-end gap-5'>
      <BoxInfo label='24H Vol' value='$176.30M' />
      <BoxInfo label='24H High' value='$174.10' />
      <BoxInfo label='24H Low' value='$170.29' />
    </div>
  );
}
