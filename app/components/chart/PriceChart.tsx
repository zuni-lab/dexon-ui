export default function PriceChart() {
  return (
    <div className='h-[500px] relative'>
      <iframe
        height='100%'
        width='100%'
        id='geckoterminal-embed'
        title='GeckoTerminal Embed'
        src='https://www.geckoterminal.com/eth/pools/0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=1d'
        allow='clipboard-write'
        allowFullScreen
      />
    </div>
  );
}
